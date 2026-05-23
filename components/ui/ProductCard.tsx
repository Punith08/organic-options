import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [added, setAdded] = useState(false)

  const isOOS = product.stock_status === 'outofstock'
  const wished = isInWishlist(product.id)
  const image = product.images[0]
  const category = product.categories[0]
  const rating = parseFloat(product.average_rating) || 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOOS) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    wished ? removeFromWishlist(product.id) : addToWishlist(product)
  }

  return (
    <Link href={`/product/${product.slug}`} className="card group block relative">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-50">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-primary-50 gap-3">
            <svg className="w-16 h-16 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="text-primary-300 text-sm font-medium px-4 text-center leading-tight">{product.name}</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOOS && <span className="text-[10px] font-semibold bg-stone-700 text-white px-2 py-0.5 rounded-full">OUT OF STOCK</span>}
          {product.on_sale && !isOOS && <span className="text-[10px] font-semibold bg-accent text-white px-2 py-0.5 rounded-full">SALE</span>}
          {product.featured && !isOOS && <span className="text-[10px] font-semibold bg-primary text-white px-2 py-0.5 rounded-full">FEATURED</span>}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            wished ? 'bg-accent text-white' : 'bg-white/90 text-bark/50 hover:text-accent hover:bg-white'
          }`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg className="w-4 h-4" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* OOS overlay */}
        {isOOS && <div className="absolute inset-0 bg-white/60" />}
      </div>
      {/* Info */}
      <div className="p-4">
        {category && (
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1.5">{category.name}</p>
        )}
        <h3 className="font-serif font-medium text-bark text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {/* Stars */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-accent' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[10px] text-bark/40">({product.rating_count})</span>
          </div>
        )}
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {product.on_sale && product.regular_price ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-bark text-lg">₹{product.sale_price}</span>
                <span className="text-bark/40 text-sm line-through">₹{product.regular_price}</span>
              </div>
            ) : (
              <span className="font-bold text-bark text-lg">₹{product.price}</span>
            )}
          </div>
        </div>
        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={isOOS}
          className={`mt-3 w-full py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            isOOS
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : added
              ? 'bg-primary-700 text-white'
              : 'bg-primary text-white hover:bg-primary-700 active:scale-95'
          }`}
        >
          {isOOS ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
