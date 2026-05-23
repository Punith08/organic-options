import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { state, removeItem, updateQty } = useCart()

  const subtotal = state.total
  const gst = Math.round(subtotal * 0.05)
  const shipping = subtotal >= 999 ? 0 : 80
  const grandTotal = subtotal + gst + shipping

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
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-primary font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="border-t border-stone-100 pt-2 flex justify-between font-semibold text-bark text-base">
                  <span>Total</span><span>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
              {subtotal < 999 && (
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
