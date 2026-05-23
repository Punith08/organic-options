import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface FormData {
  first_name: string; last_name: string; email: string; phone: string
  address_1: string; address_2: string; city: string; state: string; postcode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', email: '', phone: '',
    address_1: '', address_2: '', city: '', state: '', postcode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [liveShipping, setLiveShipping] = useState<number | null>(null)
  const [shippingInfo, setShippingInfo] = useState<{ courier?: string; etd?: string } | null>(null)
  const [fetchingRate, setFetchingRate] = useState(false)

  const subtotal = state.total
  const gst = Math.round(subtotal * 0.05)
  const shipping = subtotal >= 999 ? 0 : (liveShipping ?? 80)
  const grandTotal = subtotal + gst + shipping

  useEffect(() => {
    if (state.items.length === 0) router.push('/cart')
  }, [state.items, router])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  useEffect(() => {
    if (subtotal >= 999 || !/^\d{6}$/.test(form.postcode)) return
    const timer = setTimeout(async () => {
      setFetchingRate(true)
      try {
        const weight = Math.max(0.5, state.items.reduce((acc, i) => acc + i.quantity * 0.5, 0))
        const res = await fetch('/api/shipping-rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postcode: form.postcode, weight }),
        })
        const data = await res.json()
        setLiveShipping(data.rate)
        setShippingInfo(data.available ? { courier: data.courier, etd: data.etd } : null)
      } catch {
        setLiveShipping(80)
        setShippingInfo(null)
      } finally {
        setFetchingRate(false)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [form.postcode, subtotal, state.items])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/razorpay-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      })
      const { orderId } = await res.json()
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: 'INR',
        order_id: orderId,
        name: 'Organic Options',
        description: 'Organic Products',
        theme: { color: '#258071' },
        prefill: { name: `${form.first_name} ${form.last_name}`, email: form.email, contact: form.phone },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/razorpay-verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                address: { ...form, country: 'IN' },
                items: state.items.map(i => ({
                  product_id: i.product.id,
                  variation_id: i.selectedVariation?.id,
                  quantity: i.quantity,
                })),
                total: grandTotal,
              }),
            })
            const data = await verifyRes.json()
            if (data.success) {
              clearCart()
              router.push(`/order-confirmation?orderId=${data.wcOrderId}`)
            } else {
              setError(data.error || 'Payment verification failed')
            }
          } catch {
            setError('Order creation failed. Please contact support.')
          }
          setLoading(false)
        },
      })
      rzp.open()
    } catch {
      setError('Could not initiate payment. Please try again.')
    }
    setLoading(false)
  }

  if (state.items.length === 0) return null

  return (
    <Layout title="Checkout">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-8">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <h2 className="font-semibold text-bark mb-2">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-bark/70 mb-1">First Name *</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bark/70 mb-1">Last Name *</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Phone *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Address Line 1 *</label>
              <input name="address_1" value={form.address_1} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Address Line 2 <span className="text-bark/40">(optional)</span></label>
              <input name="address_2" value={form.address_2} onChange={handleChange} className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-bark/70 mb-1">City *</label>
                <input name="city" value={form.city} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bark/70 mb-1">State *</label>
                <input name="state" value={form.state} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-bark/70 mb-1">Pincode *</label>
                <input name="postcode" value={form.postcode} onChange={handleChange} required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            <button type="submit" disabled={loading} className="btn-accent w-full justify-center text-base py-3.5">
              {loading ? 'Processing...' : `Pay ₹${grandTotal.toFixed(0)} via Razorpay`}
            </button>
          </form>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="card p-6 sticky top-20">
              <h2 className="font-serif text-lg font-semibold text-bark mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-2">
                {state.items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-bark/70">
                    <span className="truncate max-w-[150px]">{item.product.name} ×{item.quantity}</span>
                    <span>₹{(parseFloat(item.selectedVariation?.price ?? item.product.price ?? '0') * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
                <div className="border-t border-stone-100 pt-2 space-y-1">
                  <div className="flex justify-between text-bark/70"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                  <div className="flex justify-between text-bark/70"><span>GST (5%)</span><span>₹{gst}</span></div>
                  <div className="flex justify-between text-bark/70">
                    <span>Shipping{shippingInfo?.courier ? ` · ${shippingInfo.courier}` : ''}</span>
                    <span>{shipping === 0 ? 'FREE' : fetchingRate ? '...' : `₹${shipping}`}</span>
                  </div>
                  {shippingInfo?.etd && <div className="text-xs text-bark/50 text-right">Estimated: {shippingInfo.etd}</div>}
                  <div className="flex justify-between font-semibold text-bark text-base pt-1 border-t border-stone-100">
                    <span>Total</span><span>₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
