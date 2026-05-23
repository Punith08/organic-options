import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/layout/Layout'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [added, setAdded] = useState<Record<number, boolean>>({})

  const handleAddToCart = (productId: number) => {
    const product = items.find(p => p.id === productId)
    if (!product || product.stock_status === 'outofstock') return
    addItem(product, 1)
    setAdded(prev => ({ ...prev, [productId]: true }))
    setTimeout(() => setAdded(prev => ({ ...prev, [productId]: false })), 1500)
  }

  if (items.length === 0) {
    return (
      <Layout title="Wishlist" description="Your Organic Options wishlist.">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-bark mb-3">Your wishlist is empty</h1>
          <p className="text-bark/50 mb-8">Save products you love and come back to them any time.</p>
          <Link href="/shop" className="btn-primary">Browse Products</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Wishlist" description="Your saved organic products.">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-bark">My Wishlist</h1>
            <p className="text-bark/50 text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-sm text-bark/40 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map(product => {
            const isOOS = product.stock_status === 'outofstock'
            const image = product.images[0]
            const category = product.categories[0]
            const wasAdded = added[product.id]

            return (
              <div key={product.id} className="card group relative">
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-bark/40 hover:text-red-500 hover:bg-white transition-all"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-50 text-4xl font-serif text-primary-300">
                        {product.name.charAt(0)}
                      </div>
                    )}
                    {isOOS && <div className="absolute inset-0 bg-white/60" />}
                    {isOOS && (
                      <span className="absolute top-2 left-2 text-[10px] font-semibold bg-stone-700 text-white px-2 py-0.5 rounded-full">OUT OF STOCK</span>
                    )}
                  </div>

                  <div className="p-4">
                    {category && (
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1">{category.name}</p>
                    )}
                    <h3 className="font-serif font-medium text-bark text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="mb-3">
                      {product.on_sale && product.regular_price ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-bark">₹{product.sale_price}</span>
                          <span className="text-bark/40 text-sm line-through">₹{product.regular_price}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-bark">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={isOOS}
                    className={`w-full py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isOOS
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : wasAdded
                        ? 'bg-primary-700 text-white'
                        : 'bg-primary text-white hover:bg-primary-700 active:scale-95'
                    }`}
                  >
                    {isOOS ? 'Out of Stock' : wasAdded ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </Layout>
  )
}
