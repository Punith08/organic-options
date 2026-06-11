import type { NextApiRequest, NextApiResponse } from 'next'
import { getDelhiveryRates, DelhiveryOption } from '@/lib/delhivery'
import { getShippingRates } from '@/lib/shiprocket'
import { getBorzoRates, isBangalorePincode } from '@/lib/borzo'

export type { DelhiveryOption as ShiprocketCourier } from '@/lib/delhivery'

// Map Shiprocket courier response to the same shape as DelhiveryOption
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapShiprocketCouriers(raw: any[]): DelhiveryOption[] {
  return raw
    .filter(c => c.rate > 0)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 6)
    .map(c => ({
      id: c.courier_company_id,
      name: c.courier_name,
      rate: Math.round(c.rate),
      etd: c.etd ?? '',
      estimated_days: c.estimated_delivery_days ? `${c.estimated_delivery_days} days` : '',
    }))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { postcode, weight = 0.5 } = req.body
  if (!postcode || !/^\d{6}$/.test(String(postcode))) {
    return res.status(400).json({ error: 'Invalid postcode' })
  }
  try {
    const pin = String(postcode)
    const wt = Number(weight)

    // 1. For Bangalore pincodes: try Borzo + Delhivery in parallel
    if (isBangalorePincode(pin)) {
      const [borzoCouriers, delhiveryCouriers] = await Promise.all([
        getBorzoRates(pin).catch(() => []),
        getDelhiveryRates(pin, wt).catch(() => []),
      ])
      const couriers = [...borzoCouriers, ...delhiveryCouriers]
      if (couriers.length) {
        return res.json({ couriers, available: true, provider: 'borzo+delhivery' })
      }
    }

    // 2. Non-Bangalore (or Bangalore with no local rates) — try Delhivery
    const delhiveryCouriers = await getDelhiveryRates(pin, wt)
    if (delhiveryCouriers.length) {
      return res.json({ couriers: delhiveryCouriers, available: true, provider: 'delhivery' })
    }

    // 3. Fall back to Shiprocket
    const data = await getShippingRates(pin, wt, false)
    const raw: unknown[] = data?.data?.available_courier_companies ?? []
    const couriers = mapShiprocketCouriers(raw)
    if (!couriers.length) return res.json({ couriers: [], available: false })
    return res.json({ couriers, available: true, provider: 'shiprocket' })
  } catch {
    res.json({ couriers: [], available: false })
  }
}
