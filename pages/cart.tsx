import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { state, removeItem, updateQty } = useCart()

  const [pincode, setPincode] = useState('')
  const [liveShipping, setLiveShipping] = useState<number | null>(null)
  const [shippingInfo, setShippingInfo] = useState<{ courier?: string; etd?: string } | null>(null)
  const [fetchingRate, setFetchingRate] = useState(false)

  const subtotal = state.total
  const gst = Math.round(subtotal * 0.05)
  const shipping = subtotal >= 999 ? 0 : (liveShipping ?? 80)
  const grandTotal = subtotal + gst + shipping

  useEffect(() => {
    if (subtotal >= 999 || !/^\d{6}$/.test(pincode)) {
      setLiveShipping(null)
      setShippingInfo(null)
      return
    }
    const timer = setTimeout(async () => {
      setFetchingRate(true)
      try {
        const weight = Math.max(0.5, state.items.reduce((acc, i) => acc + i.quantity * 0.5, 0))
        const res = await fetch('/api/shipping-rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postcode: pincode, weight }),
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
  }, [pincode, subtotal, state.items])

  if (state.items.length === 0) {
    return (
      <Layout title="Cart">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="font-serif text-2xl font-semibold text-bark mb-3">Your cart is empty</h1>
          <p className="text-bark/50 mb-8">Add some organic goodness to get started.</p>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Cart">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-8">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {state.items.map(item => {
              const price = parseFloat(item.selectedVariation?.price ?? item.product.price ?? '0')
              return (
                <div key={item.product.id} className="card p-4 flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-50 shrink-0">
                    {item.product.images[0] ? (
                      <Image src={item.product.images[0].src} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-medium text-bark text-sm mb-0.5 truncate">{item.product.name}</h3>
                    {item.selectedVariation && (
                      <p className="text-xs text-bark/50 mb-1">
                        {item.selectedVariation.attributes.map(a => `${a.name}: ${a.option}`).join(', ')}
                      </p>
                    )}
                    <p className="text-primary font-semibold text-sm mb-2">₹{price.toFixed(0)}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
                        <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-bark hover:bg-stone-100 text-sm">−</button>
                        <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-bark hover:bg-stone-100 text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-bark">₹{(price * item.quantity).toFixed(0)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="card p-6 sticky top-20">
              <h2 className="font-serif text-lg font-semibold text-bark mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-bark/70"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between text-bark/70"><span>GST (5%)</span><span>₹{gst}</span></div>
                <div className="flex justify-between text-bark/70">
                  <span>
                    Shipping
                    {shippingInfo?.courier && (
                      <span className="block text-xs text-bark/40 font-normal">{shippingInfo.courier}</span>
                    )}
                  </span>
                  <span className={shipping === 0 ? 'text-primary font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : fetchingRate ? (
                      <span className="inline-block w-8 h-4 bg-stone-200 rounded animate-pulse" />
                    ) : `₹${shipping}`}
                  </span>
                </div>
                {shippingInfo?.etd && (
                  <div className="text-xs text-bark/40 text-right">Est. delivery: {shippingInfo.etd}</div>
                )}
                <div className="border-t border-stone-100 pt-2 flex justify-between font-semibold text-bark text-base">
                  <span>Total</span><span>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Pincode checker */}
              {subtotal < 999 && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-bark/60 mb-1">
                    Check delivery to pincode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="e.g. 560001"
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                    {fetchingRate && (
                      <span className="text-xs text-bark/40 self-center">Checking…</span>
                    )}
                  </div>
                  {liveShipping !== null && !fetchingRate && (
                    <p className="text-xs text-primary mt-1">
                      {shippingInfo?.courier
                        ? `Shipping via ${shippingInfo.courier}${shippingInfo.etd ? ` · ${shippingInfo.etd}` : ''}`
                        : 'Shipping rate updated'}
                    </p>
                  )}
                </div>
              )}

              {subtotal < 999 && !liveShipping && (
                <p className="text-xs text-primary bg-primary-50 rounded-lg p-2 mb-4">
                  Add ₹{(999 - subtotal).toFixed(0)} more for free shipping!
                </p>
              )}

              <Link href="/checkout" className="btn-primary w-full justify-center text-base py-3">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
