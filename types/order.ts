import { Product } from './product'
export interface CartItem {
  product: Product; quantity: number
  selectedVariation?: { id: number; attributes: { name: string; option: string }[]; price: string }
}
export interface CartState { items: CartItem[]; total: number; itemCount: number }
export interface ShippingAddress {
  first_name: string; last_name: string; address_1: string; address_2: string
  city: string; state: string; postcode: string; country: string; phone: string; email: string
}
export interface OrderPayload {
  payment_method: string; payment_method_title: string; set_paid: boolean
  billing: ShippingAddress; shipping: ShippingAddress
  line_items: { product_id: number; variation_id?: number; quantity: number }[]
  razorpay_payment_id?: string; razorpay_order_id?: string
}
