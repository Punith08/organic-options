import crypto from 'crypto'
export function verifyRazorpaySignature(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean {
  const body = razorpayOrderId + '|' + razorpayPaymentId
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body).digest('hex')
  return expected === razorpaySignature
}
export async function createRazorpayOrder(amount: number, receiptId: string) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64') },
    body: JSON.stringify({ amount: amount * 100, currency: 'INR', receipt: receiptId }),
  })
  if (!res.ok) throw new Error('Razorpay order creation failed')
  return res.json()
}
