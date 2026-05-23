import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/ui/ProductCard'
import { getProducts, getCategories, getCategoryBySlug } from '@/lib/woocommerce'
import { Product, Category } from '@/types/product'

interface Props {
  products: Product[]
  categories: Category[]
  activeCategorySlug: string | null
  search: string
  sort: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  try {
    const slug = (query.category as string) || null
    const search = (query.search as string) || ''
    const sort = (query.sort as string) || 'default'

    const categoriesPromise = getCategories()
    const params: Record<string, string | number> = { per_page: 48 }

    if (search) params.search = search

    let productsPromise: Promise<Product[]>
    if (slug) {
      const cat = await getCategoryBySlug(slug)
      if (cat) {
        params.category = cat.id
        productsPromise = getProducts(params)
      } else {
        productsPromise = Promise.resolve([])
      }
    } else {
      productsPromise = getProducts(params)
    }

    const [categories, products] = await Promise.all([categoriesPromise, productsPromise])

    // Client-side sort
    let sorted = [...products]
    if (sort === 'price_asc') sorted.sort((a, b) => parseFloat(a.price || '0') - parseFloat(b.price || '0'))
    if (sort === 'price_desc') sorted.sort((a, b) => parseFloat(b.price || '0') - parseFloat(a.price || '0'))
    if (sort === 'rating') sorted.sort((a, b) => parseFloat(b.average_rating || '0') - parseFloat(a.average_rating || '0'))

    return { props: { products: sorted, categories, activeCategorySlug: slug, search, sort } }
  } catch {
    return { props: { products: [], categories: [], activeCategorySlug: null, search: '', sort: 'default' } }
  }
}

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ShopPage({ products, categories, activeCategorySlug, search, sort }: Props) {
  const router = useRouter()

  const activeCategory = categories.find(c => c.slug === activeCategorySlug)
  const title = search
    ? `Search: "${search}"`
    : activeCategory
    ? activeCategory.name
    : 'All Products'

  const buildHref = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams()
    const current = { category: activeCategorySlug, search, sort }
    const merged = { ...current, ...overrides }
    if (merged.category) params.set('category', merged.category)
    if (merged.search) params.set('search', merged.search)
    if (merged.sort && merged.sort !== 'default') params.set('sort', merged.sort)
    const qs = params.toString()
    return `/shop${qs ? `?${qs}` : ''}`
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildHref({ sort: e.target.value }))
  }

  return (
    <Layout title={title} description="Browse certified organic products from Organic Options Farms.">
      {/* Page header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-xs text-bark/40 mb-3">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-bark">Shop</span>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-bark">{activeCategory.name}</span>
              </>
            )}
          </nav>
          <h1 className="font-serif text-3xl font-semibold text-bark">{title}</h1>
          <p className="text-bark/50 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-stone-100 p-5 sticky top-[136px]">
              <h2 className="font-semibold text-bark text-xs uppercase tracking-widest mb-4">Categories</h2>
              <div className="flex flex-col gap-0.5">
                <Link
                  href="/shop"
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    !activeCategorySlug && !search ? 'bg-primary text-white' : 'text-bark/70 hover:bg-stone-50'
                  }`}
                >
                  All Products
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={buildHref({ category: cat.slug, search: null })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                      activeCategorySlug === cat.slug ? 'bg-primary text-white' : 'text-bark/70 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.count > 0 && (
                      <span className={`text-xs ${activeCategorySlug === cat.slug ? 'text-white/60' : 'text-bark/30'}`}>
                        {cat.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex flex-wrap gap-2">
                {search && (
                  <Link
                    href={buildHref({ search: null })}
                    className="inline-flex items-center gap-1.5 text-xs bg-primary-50 text-primary px-3 py-1.5 rounded-full"
                  >
                    Search: &quot;{search}&quot;
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs text-bark/50">Sort:</label>
                <select
                  value={sort}
                  onChange={handleSort}
                  className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-bark focus:outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-bark mb-2">No products found</h3>
                <p className="text-bark/50 text-sm mb-6">Try a different search or browse all products.</p>
                <Link href="/shop" className="btn-primary">Browse All</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
