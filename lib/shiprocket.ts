interface TokenCache { token: string; expiresAt: number }
let tokenCache: TokenCache | null = null

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Shiprocket auth failed: ${data.message}`)
  tokenCache = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 }
  return data.token
}

export async function getShippingRates(deliveryPostcode: string, weight: number, cod = false) {
  const t = await getToken()
  const params = new URLSearchParams({
    pickup_postcode: process.env.SHIPROCKET_PICKUP_POSTCODE || '560064',
    delivery_postcode: deliveryPostcode,
    weight: String(weight),
    cod: cod ? '1' : '0',
  })
  const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`, {
    headers: { Authorization: `Bearer ${t}` },
  })
  return res.json()
}

export async function createShiprocketOrder(order: Record<string, unknown>) {
  const t = await getToken()
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify(order),
  })
  return res.json()
}
