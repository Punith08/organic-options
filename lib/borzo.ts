const BASE = 'https://robot-in.borzodelivery.com/api/business/1.8'

function authHeader() {
  return {
    Authorization: `Bearer ${process.env.BORZO_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

// Bangalore pincodes start with 560
export function isBangalorePincode(pincode: string): boolean {
  return /^560/.test(pincode)
}

export interface BorzoOption {
  id: number
  name: string
  rate: number
  etd: string
  estimated_days: string
}

function requiredStartDatetime(): string {
  // 2 hours from now, formatted as ISO with IST offset
  const d = new Date(Date.now() + 2 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 19) + '+05:30'
}

export async function getBorzoRates(destPin: string): Promise<BorzoOption[]> {
  const originPin =
    process.env.BORZO_PICKUP_POSTCODE ||
    process.env.DELHIVERY_PICKUP_POSTCODE ||
    '560064'

  const body = {
    type: 8, // motorbike delivery
    matter: 'Organic farm produce',
    points: [
      {
        address: `${originPin}, Bangalore, Karnataka, India`,
        required_start_datetime: requiredStartDatetime(),
      },
      {
        address: `${destPin}, Bangalore, Karnataka, India`,
      },
    ],
  }

  const res = await fetch(`${BASE}/calculate-order`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(body),
  })

  if (!res.ok) return []

  const data = await res.json()
  if (!data?.is_successful || !data?.order) return []

  const price: number =
    data.order.delivery_fee_for_customer ?? data.order.price ?? 0
  if (!price) return []

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const etd = tomorrow.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return [
    {
      id: 100,
      name: 'Borzo Express',
      rate: Math.round(price),
      etd,
      estimated_days: 'Same day – Next day',
    },
  ]
}
