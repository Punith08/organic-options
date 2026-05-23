import type { NextApiRequest, NextApiResponse } from 'next'
import { getShippingRates } from '@/lib/shiprocket'

type Courier = { rate: number; courier_name: string; etd: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { postcode, weight = 0.5 } = req.body
  if (!postcode || !/^\d{6}$/.test(String(postcode))) {
    return res.status(400).json({ error: 'Invalid postcode' })
  }
  try {
    const data = await getShippingRates(String(postcode), Number(weight), false)
    const couriers: Courier[] = data?.data?.available_courier_companies ?? []
    if (!couriers.length) return res.json({ rate: 80, available: false })
    const cheapest = couriers.sort((a, b) => a.rate - b.rate)[0]
    res.json({ rate: Math.round(cheapest.rate), courier: cheapest.courier_name, etd: cheapest.etd, available: true })
  } catch {
    res.json({ rate: 80, available: false })
  }
}
