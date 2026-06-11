const BASE = 'https://track.delhivery.com'

function authHeader() {
  return { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` }
}

// Zone → estimated transit days { surface, express }
const ZONE_DAYS: Record<string, { surface: number; express: number }> = {
  A: { surface: 2, express: 1 },
  B: { surface: 3, express: 2 },
  C: { surface: 4, express: 3 },
  D: { surface: 5, express: 4 },
  E: { surface: 7, express: 5 },
}

function etdLabel(zone: string, mode: 'surface' | 'express'): { etd: string; days: string } {
  const base = ZONE_DAYS[zone] ?? { surface: 5, express: 3 }
  const days = base[mode]
  const date = new Date()
  date.setDate(date.getDate() + days)
  return {
    etd: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    days: `${days}-${days + 1} days`,
  }
}

async function fetchRate(
  originPin: string,
  destPin: string,
  weightGrams: number,
  mode: 'S' | 'E',
) {
  const params = new URLSearchParams({
    md: mode,
    ss: 'Delivered',
    d_pin: destPin,
    o_pin: originPin,
    cgm: String(weightGrams),
    pt: 'Pre-paid',
    cod: '0',
  })
  const res = await fetch(`${BASE}/api/kinko/v1/invoice/charges/.json?${params}`, {
    headers: authHeader(),
  })
  const data = await res.json()
  return Array.isArray(data) ? data[0] : null
}

export async function checkServiceability(pincode: string): Promise<boolean> {
  const res = await fetch(`${BASE}/c/api/pin-codes/json/?filter_codes=${pincode}`, {
    headers: authHeader(),
  })
  const data = await res.json()
  const code = data?.delivery_codes?.[0]?.postal_code
  return code?.pre_paid === 'Y'
}

export interface DelhiveryOption {
  id: number
  name: string
  rate: number
  etd: string
  estimated_days: string
}

export async function getDelhiveryRates(
  destPin: string,
  weightKg: number,
): Promise<DelhiveryOption[]> {
  const originPin = process.env.DELHIVERY_PICKUP_POSTCODE || process.env.SHIPROCKET_PICKUP_POSTCODE || '560064'
  const grams = Math.round(weightKg * 1000)

  // Run serviceability + both rate calls in parallel
  const [serviceable, surfaceData, expressData] = await Promise.all([
    checkServiceability(destPin),
    fetchRate(originPin, destPin, grams, 'S'),
    fetchRate(originPin, destPin, grams, 'E'),
  ])

  if (!serviceable) return []

  const results: DelhiveryOption[] = []

  if (surfaceData?.total_amount > 0) {
    const zone = surfaceData.zone ?? 'C'
    const { etd, days } = etdLabel(zone, 'surface')
    results.push({
      id: 1,
      name: 'Delhivery Surface',
      rate: Math.round(surfaceData.total_amount),
      etd,
      estimated_days: days,
    })
  }

  if (expressData?.total_amount > 0) {
    const zone = expressData.zone ?? 'C'
    const { etd, days } = etdLabel(zone, 'express')
    results.push({
      id: 2,
      name: 'Delhivery Express',
      rate: Math.round(expressData.total_amount),
      etd,
      estimated_days: days,
    })
  }

  return results
}
