import type { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import { getFeaturedProducts, getCategories, getProducts } from '@/lib/woocommerce'
import { Product, Category } from '@/types/product'

interface Props { featured: Product[]; categories: Category[]; moreProducts: Product[] }

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const [featured, categories, moreProducts] = await Promise.all([
      getFeaturedProducts(),
      getCategories(),
      getProducts({ per_page: 8, orderby: 'date', order: 'desc' }),
    ])
    return { props: { featured, categories, moreProducts }, revalidate: 60 }
  } catch {
    return { props: { featured: [], categories: [], moreProducts: [] }, revalidate: 60 }
  }
}

const TRUST = [
  { icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ), label: 'FSSAI Certified' },
  { icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
  ), label: 'Lab Tested' },
  { icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ), label: 'Direct from Farm' },
  { icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
  ), label: 'Free Delivery ₹999+' },
]

const WHY = [
  {
    title: 'Own Farms',
    desc: 'Every product is grown on our certified organic farm in Karnataka — we never source from third parties.',
    color: 'bg-primary-50',
    textColor: 'text-primary',
  },
  {
    title: 'Lab Tested',
    desc: 'All products undergo rigorous testing for pesticide residue, heavy metals, and nutritional quality.',
    color: 'bg-accent-50',
    textColor: 'text-accent',
  },
  {
    title: 'No Chemicals',
    desc: 'Zero synthetic pesticides, fertilisers, or GMOs — ever. Our soil is as healthy as your food.',
    color: 'bg-primary-50',
    textColor: 'text-primary',
  },
  {
    title: 'Fair Trade',
    desc: 'Our farmers are paid fairly, treated with dignity, and empowered to make decisions about their land.',
    color: 'bg-accent-50',
    textColor: 'text-accent',
  },
]

export default function HomePage({ featured, categories, moreProducts }: Props) {
  return (
    <Layout
      title="Organic Options — Purity, You Can Trust"
      description="Certified organic products direct from our Karnataka farm. Grains, pulses, oils, spices and more — FSSAI certified and lab tested."
    >
      {/* ─── HERO BANNER ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        <div className="relative overflow-hidden h-[75vh] rounded-3xl ring-4 ring-primary/25 shadow-2xl max-w-7xl mx-auto bg-[#d6ede8]">
          <Image
            src="/Artboard 1000000.jpg.avif"
            fill
            className="object-contain object-center"
            alt="Organic Options Farm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 via-primary-900/20 to-transparent" />
          {/* Trust strip at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10 py-3 px-6">
            <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
              {TRUST.map(t => (
                <div key={t.label} className="flex items-center gap-2 text-white text-xs font-medium">
                  <span className="text-primary-300">{t.icon}</span>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Browse the range</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link href="/shop" className="text-primary text-sm font-medium hover:underline hidden md:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map(cat => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-stone-100 hover:border-primary hover:shadow-md transition-all duration-200"
              >
                {cat.image ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-stone-100 group-hover:ring-primary transition-all">
                    <Image src={cat.image.src} alt={cat.image.alt || cat.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                )}
                <span className="text-xs font-medium text-bark text-center group-hover:text-primary transition-colors leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── FEATURED PRODUCTS ───────────────────────────────────── */}
      <section className="bg-stone-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Handpicked for you</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link href="/shop" className="btn-outline text-sm px-6 py-2.5 hidden md:inline-flex">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {featured.length === 0
              ? [1,2,3,4,5,6].map(i => <ProductCardSkeleton key={i} />)
              : featured.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="btn-outline text-sm">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ─── MORE PRODUCTS ───────────────────────────────────────── */}
      {moreProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Fresh from the farm</p>
              <h2 className="section-title">More Products</h2>
            </div>
            <Link href="/shop" className="btn-outline text-sm px-6 py-2.5 hidden md:inline-flex">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {moreProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="btn-outline text-sm">View All Products</Link>
          </div>
        </section>
      )}

      {/* ─── FARM BOX BANNER ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-bark rounded-3xl overflow-hidden relative">
          {/* CSS art background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-primary opacity-10" />
            <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] rounded-full bg-primary-300 opacity-10" />
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-10 md:p-14">
              <span className="inline-block bg-accent/20 text-accent text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">Monthly Subscription</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                The Organic Options<br />Farm Box
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-8 max-w-sm">
                Seasonal organic essentials — grains, pulses, oils, spices, herbal teas and a seasonal surprise — curated from our farm.
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <span className="font-bold text-white text-3xl">₹999</span>
                </div>
                <Link href="/farm-box" className="btn-accent">Subscribe Now</Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center p-10 opacity-20">
              <svg viewBox="0 0 200 200" className="w-64 h-64 text-primary-300" fill="currentColor">
                <path d="M100 10 C100 10, 170 50, 170 100 C170 140 140 180 100 190 C60 180 30 140 30 100 C30 50 100 10 100 10Z" />
                <path d="M100 40 C100 40, 150 65, 150 100 C150 130 130 160 100 170 C70 160 50 130 50 100 C50 65 100 40 100 40Z" fill="rgba(255,255,255,0.2)" />
                <circle cx="100" cy="100" r="20" fill="rgba(255,255,255,0.3)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY ORGANIC OPTIONS ─────────────────────────────────── */}
      <section className="bg-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-widest mb-3">Why choose us</p>
            <h2 className="font-serif text-4xl font-semibold text-white">Grown with integrity,<br />delivered with care</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map(w => (
              <div key={w.title} className="bg-white/5 rounded-2xl p-7 border border-white/10">
                <div className={`w-10 h-10 rounded-xl ${w.color} ${w.textColor} flex items-center justify-center mb-4`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-white text-lg mb-2">{w.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FARM EXPERIENCE CTA ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative h-72 md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/Artboard 1000000.jpg.avif"
              fill
              className="object-cover"
              alt="Visit our organic farm in Karnataka"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
          </div>
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">Farm Experience</p>
            <h2 className="section-title mb-4">Visit Our Farm in Karnataka</h2>
            <p className="text-bark/60 leading-relaxed mb-6">
              Walk through our fields, meet our farmers, and experience organic farming first-hand. Our farm visits include guided tours, hands-on harvesting, and a farm-to-table lunch.
            </p>
            <ul className="space-y-3 mb-8">
              {['Guided farm walk with our head farmer', 'Hands-on harvesting session', 'Farm-to-table organic lunch', 'Take-home produce pack'].map(item => (
                <li key={item} className="flex items-center gap-3 text-bark/70 text-sm">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/farm-experience" className="btn-primary">Explore Farm Experience</Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="bg-cream py-20 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">Customer Stories</p>
            <h2 className="section-title">Trusted by families<br />across India</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya R.', city: 'Bengaluru', text: 'The cold-pressed oils are absolutely incredible. I can taste the difference from supermarket oils. Will never go back!' },
              { name: 'Anil K.', city: 'Mysuru', text: 'The Farm Box is such a thoughtful subscription. Every month feels like a surprise and everything is genuinely fresh.' },
              { name: 'Meena S.', city: 'Chennai', text: 'I appreciate that the products are actually certified organic. The grains especially have so much more flavour.' },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-7 border border-stone-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-bark/70 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-serif font-semibold text-primary text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-bark text-sm">{t.name}</p>
                    <p className="text-bark/40 text-xs">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG TEASER ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">From the farm</p>
            <h2 className="section-title">Stories &amp; Recipes</h2>
          </div>
          <Link href="/blog" className="text-primary text-sm font-medium hover:underline hidden md:block">
            All articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Why Cold-Pressed Oils Are Better for Your Health', tag: 'Nutrition', date: 'May 2025' },
            { title: 'A Guide to Cooking with Organic Millets', tag: 'Recipes', date: 'Apr 2025' },
            { title: 'How We Farm: Our Approach to Organic Certification', tag: 'Farm Life', date: 'Mar 2025' },
          ].map((post, i) => (
            <Link key={i} href="/blog" className="group card overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <svg className="w-20 h-20 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-semibold bg-primary text-white px-2.5 py-1 rounded-full uppercase tracking-wide">{post.tag}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-bark/40 text-xs mb-2">{post.date}</p>
                <h3 className="font-serif font-semibold text-bark leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────── */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Good food starts<br />with honest farming.
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of Indian families who have made the switch to genuine organic. Your body — and our planet — will thank you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="bg-white text-primary hover:bg-white/90 px-10 py-4 rounded-full font-medium text-base transition-all inline-flex items-center gap-2">
              Shop Now
            </Link>
            <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 rounded-full font-medium text-base transition-all inline-flex items-center gap-2">
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
