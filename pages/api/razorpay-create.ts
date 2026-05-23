import type { NextApiRequest, NextApiResponse } from 'next'
import { createRazorpayOrder } from '@/lib/razorpay'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { amount } = req.body
    const order = await createRazorpayOrder(amount, 'OO-' + Date.now())
    res.status(200).json({ orderId: order.id })
  } catch { res.status(500).json({ error: 'Failed to create order' }) }
}
