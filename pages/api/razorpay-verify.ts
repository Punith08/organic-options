import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { createOrder, updateOrderPayment } from '@/lib/woocommerce'
import { createShiprocketOrder } from '@/lib/shiprocket'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, address, items, total } = req.body
  const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
  if (!isValid) return res.status(400).json({ success: false, error: 'Invalid signature' })
  try {
    const wcOrder = await createOrder({ payment_method: 'razorpay', payment_method_title: 'Razorpay', set_paid: true, billing: address, shipping: address, line_items: items })
    await updateOrderPayment(wcOrder.id, razorpayPaymentId, razorpayOrderId)
    try { await createShiprocketOrder({ order_id: String(wcOrder.id), billing_customer_name: `${address.first_name} ${address.last_name}`, billing_phone: address.phone, billing_email: address.email, billing_address: address.address_1, billing_city: address.city, billing_state: address.state, billing_pincode: address.postcode, billing_country: 'India', shipping_is_billing: true, order_items: items.map((i: { product_id: number; quantity: number }) => ({ name: String(i.product_id), sku: `OO-${i.product_id}`, units: i.quantity, selling_price: total / items.length })), payment_method: 'Prepaid', sub_total: total, length: 10, breadth: 10, height: 10, weight: 0.5 }) } catch (e) { console.error('Shiprocket non-critical error:', e) }
    res.status(200).json({ success: true, wcOrderId: wcOrder.id })
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: 'Order creation failed' }) }
}
