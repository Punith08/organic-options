import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/ui/ProductCard'
import CategoryCarousel from '@/components/ui/CategoryCarousel'
import { getCategories, getProductsByCategory } from '@/lib/woocommerce'
import { Product, Category } from '@/types/product'

interface Props {
  category: Category
  products: Product[]
  otherCategories: Category[]
}

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, '')).trim()
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const categories = await getCategories()
    return { paths: categories.map(c => ({ params: { slug: c.slug } })), fallback: 'blocking' }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const slug = params?.slug as string
    const categories = await getCategories()
    const category = categories.find(c => c.slug === slug)
    if (!category) return { notFound: true, revalidate: 300 }

    const products = await getProductsByCategory(category.id, 48)
    // In-stock products first, keep store order within each group
    const sorted = [
      ...products.filter(p => p.stock_status !== 'outofstock'),
      ...products.filter(p => p.stock_status === 'outofstock'),
    ]
    const otherCategories = categories.filter(c => c.id !== category.id)

    return { props: { category, products: sorted, otherCategories }, revalidate: 300 }
  } catch {
    return { notFound: true, revalidate: 60 }
  }
}

export default function CategoryLandingPage({ category, products, otherCategories }: Props) {
  const name = decodeHtml(category.name)
  const description = stripTags(category.description || '')

  return (
    <Layout
      title={`${name} — Certified Organic`}
      description={description || `Shop certified organic ${name.toLowerCase()} grown on our Karnataka farm. Lab tested, chemical-free, delivered to your door.`}
    >
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-primary opacity-10" />
          <div className="absolute -bottom-32 left-1/4 w-[300px] h-[300px] rounded-full bg-primary-300 opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white">Shop</Link>
            <span>/</span>
            <span className="text-white/80">{name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <p className="text-primary-300 text-xs font-semibold uppercase tracking-widest mb-3">From our farm</p>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">{name}</h1>
              <p className="text-white/70 text-base leading-relaxed max-w-xl mb-6">
                {description || `Certified organic ${name.toLowerCase()}, grown without synthetic pesticides or fertilisers on our Karnataka farm — lab tested and delivered fresh to your door.`}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-full border border-white/10">
                  <svg className="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {category.count} product{category.count !== 1 ? 's' : ''} available
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-full border border-white/10">
                  <svg className="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Lab tested & certified
                </span>
              </div>
            </div>
            {category.image && (
              <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/10 shrink-0 mx-auto md:mx-0">
                <Image src={category.image.src} alt={category.image.alt || name} fill className="object-cover" sizes="224px" priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Shop the range</p>
            <h2 className="font-serif font-semibold text-3xl text-bark leading-tight">All {name}</h2>
          </div>
          <Link href={`/shop?category=${category.slug}`} className="text-primary text-sm font-medium hover:underline hidden md:block">
            Filter & sort →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold text-bark mb-2">Nothing in stock right now</h3>
            <p className="text-bark/50 text-sm mb-6">This category is being restocked from the farm. Check back soon!</p>
            <Link href="/shop" className="btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ─── WHY OUR PRODUCE ──────────────────────────────────── */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Grown on Our Farms', desc: 'Every item is cultivated on our own certified organic farmland in Karnataka — never sourced from third parties.' },
              { title: 'Zero Chemicals', desc: 'No synthetic pesticides, fertilisers, or GMOs. Rigorously lab tested for purity before it reaches you.' },
              { title: 'Farm-Fresh Delivery', desc: 'Harvested, packed, and shipped directly from the farm. Free delivery on orders above ₹999.' },
            ].map(item => (
              <div key={item.title} className="bg-primary-50/50 rounded-2xl p-7 border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-bark text-lg mb-2">{item.title}</h3>
                <p className="text-bark/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MORE CATEGORIES ──────────────────────────────────── */}
      {otherCategories.length > 0 && <CategoryCarousel categories={otherCategories} />}
    </Layout>
  )
}
