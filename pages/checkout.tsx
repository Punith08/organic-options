import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'
import type { ShiprocketCourier } from './api/shipping-rates'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface FormData {
  first_name: string; last_name: string; email: string; phone: string
  address_1: string; address_2: string; city: string; state: string; postcode: string
}

type ShippingState =
  | { status: 'idle' }
  | { status: 'fetching' }
  | { status: 'done'; couriers: ShiprocketCourier[] }
  | { status: 'unavailable' }
  | { status: 'error' }

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()

  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', email: '', phone: '',
    address_1: '', address_2: '', city: '', state: '', postcode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [razorpayReady, setRazorpayReady] = useState(false)
  const [shippingState, setShippingState] = useState<ShippingState>({ status: 'idle' })
  const [selectedCourier, setSelectedCourier] = useState<ShiprocketCourier | null>(null)

  const subtotal = state.total
  const gst = Math.round(subtotal * 0.05)
  const freeShipping = subtotal >= 999

  // Shipping cost: free if subtotal ≥ 999, else requires courier selection
  const shippingCost = freeShipping ? 0 : (selectedCourier?.rate ?? null)
  const grandTotal = shippingCost !== null ? subtotal + gst + shippingCost : null

  const pincode = form.postcode

  useEffect(() => {
    if (state.items.length === 0) router.push('/cart')
  }, [state.items, router])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setRazorpayReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayReady(true)
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  // Fetch live Shiprocket rates whenever a valid pincode is entered
  useEffect(() => {
    if (freeShipping) return
    if (!/^\d{6}$/.test(pincode)) {
      setShippingState({ status: 'idle' })
      setSelectedCourier(null)
      return
    }
    setShippingState({ status: 'fetching' })
    setSelectedCourier(null)
    const timer = setTimeout(async () => {
      try {
        // Use real WooCommerce weights; fall back to 0.5 kg per unit if unset
        const weight = Math.max(0.5, state.items.reduce((acc, i) => {
          const w = parseFloat(i.product.weight || '0') || 0.5
          return acc + w * i.quantity
        }, 0))
        const res = await fetch('/api/shipping-rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postcode: pincode, weight }),
        })
        const data = await res.json()
        if (!data.available || !data.couriers?.length) {
          setShippingState({ status: 'unavailable' })
        } else {
          setShippingState({ status: 'done', couriers: data.couriers })
        }
      } catch {
        setShippingState({ status: 'error' })
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [pincode, freeShipping, state.items])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const canPay = freeShipping || selectedCourier !== null

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canPay || grandTotal === null) return
    if (!razorpayReady) {
      setError('Payment SDK not loaded yet. Please wait a moment and try again.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/razorpay-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      })
      if (!res.ok) throw new Error('Failed to create order')
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
          setLoading(true)
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
                courier: selectedCourier?.name,
                shippingCost,
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
        modal: {
          ondismiss: () => setLoading(false),
        },
      })
      rzp.open()
    } catch {
      setError('Could not initiate payment. Please try again.')
      setLoading(false)
    }
  }

  if (state.items.length === 0) return null

  return (
    <Layout title="Checkout">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-8">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: address form ─────────────────────────────────── */}
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
                <input
                  name="postcode"
                  value={form.postcode}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* ── Courier selector ─────────────────────────── */}
            {!freeShipping && (
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                  <p className="text-sm font-medium text-bark">Shipping Method</p>
                </div>

                {shippingState.status === 'idle' && (
                  <div className="px-4 py-4 text-sm text-bark/50 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Enter your pincode above to see available delivery options.
                  </div>
                )}

                {shippingState.status === 'fetching' && (
                  <div className="px-4 py-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-4 h-4 rounded-full bg-stone-200 shrink-0" />
                        <div className="flex-1 h-4 bg-stone-200 rounded" />
                        <div className="w-12 h-4 bg-stone-200 rounded" />
                      </div>
                    ))}
                  </div>
                )}

                {shippingState.status === 'done' && (
                  <div className="divide-y divide-stone-100">
                    {shippingState.couriers.map(courier => (
                      <label
                        key={courier.id}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedCourier?.id === courier.id ? 'bg-primary-50' : 'hover:bg-stone-50'}`}
                      >
                        <input
                          type="radio"
                          name="courier"
                          value={courier.id}
                          checked={selectedCourier?.id === courier.id}
                          onChange={() => setSelectedCourier(courier)}
                          className="accent-primary w-4 h-4 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-bark truncate">{courier.name}</p>
                          {courier.etd && (
                            <p className="text-xs text-bark/50">
                              Est. delivery: {courier.etd}
                              {courier.estimated_days ? ` (${courier.estimated_days})` : ''}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-bark shrink-0">₹{courier.rate}</span>
                      </label>
                    ))}
                  </div>
                )}

                {shippingState.status === 'unavailable' && (
                  <div className="px-4 py-4 text-sm text-amber-700 bg-amber-50 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No couriers available for this pincode. Please try a nearby pincode or contact us.
                  </div>
                )}

                {shippingState.status === 'error' && (
                  <div className="px-4 py-4 text-sm text-red-600 bg-red-50 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Could not fetch shipping rates. Please try again.
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || !canPay || !razorpayReady}
              className="btn-accent w-full justify-center text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Processing...'
                : !canPay
                ? 'Select a shipping method to continue'
                : !razorpayReady
                ? 'Loading payment...'
                : `Pay ₹${grandTotal?.toFixed(0)} via Razorpay`}
            </button>
          </form>

          {/* ── Right: order summary ───────────────────────────────── */}
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

                  {freeShipping ? (
                    <div className="flex justify-between text-primary font-medium"><span>Shipping</span><span>FREE</span></div>
                  ) : shippingState.status === 'fetching' ? (
                    <div className="flex justify-between text-bark/70">
                      <span>Shipping</span>
                      <span className="inline-block w-12 h-4 bg-stone-200 rounded animate-pulse" />
                    </div>
                  ) : selectedCourier ? (
                    <div className="flex justify-between text-bark/70">
                      <span className="truncate max-w-[120px]">Shipping · {selectedCourier.name}</span>
                      <span>₹{selectedCourier.rate}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-bark/40 text-xs italic">
                      <span>Shipping</span><span>—</span>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold text-bark text-base pt-1 border-t border-stone-100">
                    <span>Total</span>
                    <span>{grandTotal !== null ? `₹${grandTotal.toFixed(0)}` : '—'}</span>
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
