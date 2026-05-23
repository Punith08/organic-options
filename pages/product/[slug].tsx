import type { GetStaticPaths, GetStaticProps } from 'next'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/ui/ProductCard'
import { getAllProducts, getProductBySlug, getProductVariations, getRelatedProducts } from '@/lib/woocommerce'
import { Product, ProductVariation } from '@/types/product'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

interface Props { product: Product; variations: ProductVariation[]; related: Product[] }

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const products = await getAllProducts()
    return { paths: products.map(p => ({ params: { slug: p.slug } })), fallback: 'blocking' }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const slug = params?.slug as string
    const product = await getProductBySlug(slug)
    if (!product) return { notFound: true }
    const [variations, related] = await Promise.all([
      product.type === 'variable' ? getProductVariations(product.id) : Promise.resolve([]),
      product.categories[0] ? getRelatedProducts(product.id, product.categories[0].id) : Promise.resolve([]),
    ])
    return { props: { product, variations, related }, revalidate: 60 }
  } catch {
    return { notFound: true }
  }
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-stone-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-bark text-sm">{title}</span>
        <svg
          className={`w-4 h-4 text-bark/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4 text-bark/70 text-sm leading-relaxed">{children}</div>}
    </div>
  )
}

export default function ProductPage({ product, variations, related }: Props) {
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [mainImage, setMainImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null)
  const [added, setAdded] = useState(false)

  const isOOS = product.stock_status === 'outofstock'
  const wished = isInWishlist(product.id)
  const price = selectedVariation?.price || product.price
  const regularPrice = selectedVariation?.regular_price || product.regular_price
  const salePrice = selectedVariation?.sale_price || product.sale_price
  const isOnSale = Boolean(salePrice && salePrice !== regularPrice && parseFloat(salePrice) > 0)
  const rating = parseFloat(product.average_rating) || 0

  const handleAddToCart = () => {
    addItem(product, qty, selectedVariation ? {
      id: selectedVariation.id,
      attributes: selectedVariation.attributes,
      price: selectedVariation.price,
    } : undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlist = () => {
    wished ? removeFromWishlist(product.id) : addToWishlist(product)
  }

  return (
    <Layout
      title={product.name}
      description={product.short_description.replace(/<[^>]+>/g, '')}
      ogImage={product.images[0]?.src}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-bark/40 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          {product.categories[0] && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.categories[0].slug}`} className="hover:text-primary">
                {product.categories[0].name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-bark truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-50 mb-3">
              {product.images[mainImage] ? (
                <Image
                  src={product.images[mainImage].src}
                  alt={product.images[mainImage].alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-50 text-8xl font-serif text-primary-200">
                  {product.name.charAt(0)}
                </div>
              )}
              {isOOS && <div className="absolute inset-0 bg-white/60" />}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setMainImage(i)}
                    className={`relative w-18 h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-colors w-16 h-16 ${
                      i === mainImage ? 'border-primary' : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <Image src={img.src} alt={img.alt || ''} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categories[0] && (
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">{product.categories[0].name}</p>
            )}
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-bark mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-accent' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-bark/50 text-xs">({product.rating_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-5">
              {isOnSale ? (
                <div className="flex items-center gap-3">
                  <span className="font-bold text-3xl text-bark">₹{salePrice}</span>
                  <span className="text-bark/40 text-xl line-through">₹{regularPrice}</span>
                  <span className="text-xs font-semibold bg-accent text-white px-2.5 py-1 rounded-full">SALE</span>
                </div>
              ) : (
                <span className="font-bold text-3xl text-bark">₹{price}</span>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <div
                className="text-bark/70 text-sm leading-relaxed mb-6 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Variations */}
            {variations.length > 0 && product.attributes.map(attr => (
              <div key={attr.id} className="mb-5">
                <p className="text-sm font-semibold text-bark mb-2">{attr.name}</p>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map(opt => {
                    const v = variations.find(va => va.attributes.some(a => a.name === attr.name && a.option === opt))
                    const isSelected = selectedVariation?.attributes.some(a => a.name === attr.name && a.option === opt)
                    const isVarOOS = v?.stock_status === 'outofstock'
                    return (
                      <button
                        key={opt}
                        onClick={() => v && setSelectedVariation(v)}
                        disabled={isVarOOS || !v}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          isSelected ? 'border-primary bg-primary text-white'
                          : isVarOOS ? 'border-stone-200 text-stone-300 line-through cursor-not-allowed'
                          : 'border-stone-200 text-bark hover:border-primary hover:text-primary'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Qty + Add to cart + Wishlist */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-bark hover:bg-stone-50 transition-colors text-xl"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-bark hover:bg-stone-50 transition-colors text-xl"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isOOS}
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  isOOS ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : added ? 'bg-primary-700 text-white'
                  : 'bg-primary text-white hover:bg-primary-700 active:scale-95'
                }`}
              >
                {isOOS ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  wished ? 'border-accent bg-accent text-white' : 'border-stone-200 text-bark/40 hover:border-accent hover:text-accent'
                }`}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <svg className="w-5 h-5" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-5 text-xs text-bark/50 border-t border-stone-100 pt-5">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                100% Organic
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Lab Tested
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Free delivery ₹999+
              </span>
            </div>

            {/* Accordions */}
            <div className="mt-6 border-t border-stone-100">
              {product.description && (
                <Accordion title="Product Description">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </Accordion>
              )}
              <Accordion title="Shipping & Delivery">
                <p>We dispatch orders within 1–2 business days. Delivery takes 3–5 business days across India. Free shipping on orders above ₹999.</p>
              </Accordion>
              <Accordion title="Returns & Refunds">
                <p>We accept returns within 7 days of delivery for damaged or incorrect items. Contact us at organicoptionsblr@gmail.com with your order ID and photos.</p>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="border-t border-stone-100 pt-14">
            <h2 className="font-serif text-2xl font-semibold text-bark mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}
