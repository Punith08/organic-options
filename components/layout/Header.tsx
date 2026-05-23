import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import SearchModal from '@/components/ui/SearchModal'
import { MiniProductCardSkeleton } from '@/components/ui/ProductCardSkeleton'
import { Product, Category } from '@/types/product'

type MegaCat = {
  id: string; label: string; icon: string
  subs: string[]; wcName: string; color: string
}

const MEGA_CATS: MegaCat[] = [
  { id: 'fruits-veg', label: 'Fruits & Vegetables', icon: '🥦', color: '#d1fae5',
    subs: ['Fresh Fruits', 'Leafy Greens', 'Root Vegetables', 'Gourds & Creepers', 'Organic Vegetables'],
    wcName: 'Fruits' },
  { id: 'grains', label: 'Grains & Cereals', icon: '🌾', color: '#fef3c7',
    subs: ['Dals & Lentils', 'Atta & Flours', 'Dalia & Rava', 'Besan & Specialty'],
    wcName: 'Dals' },
  { id: 'pulses', label: 'Pulses & Lentils', icon: '🫘', color: '#fde8d8',
    subs: ['Moong Dal', 'Urad Dal', 'Chana Dal', 'Tur Dal', 'Rajma', 'Horse Gram'],
    wcName: 'Dals' },
  { id: 'oils', label: 'Cold-Pressed Oils', icon: '🫙', color: '#fef9c3',
    subs: ['Groundnut Oil', 'Coconut Oil', 'Sunflower Oil', 'Safflower Oil', 'Desi Ghee'],
    wcName: 'Cooking Oils' },
  { id: 'spices', label: 'Spices & Herbs', icon: '🌶️', color: '#fce7f3',
    subs: ['Whole Spices', 'Spice Powders', 'Masalas', 'Kasuri Methi'],
    wcName: 'Spices' },
  { id: 'rice-millets', label: 'Rice & Millets', icon: '🍚', color: '#ecfdf5',
    subs: ['Basmati Rice', 'Brown Rice', 'Red Rice', 'FoxTail Millet', 'Barnyard Millet'],
    wcName: 'Rice' },
  { id: 'sweeteners', label: 'Natural Sweeteners', icon: '🍯', color: '#fff7ed',
    subs: ['Jaggery & Jaggery Powder', 'Honey', 'Brown Sugar', 'Gulkand'],
    wcName: 'Sweeteners' },
  { id: 'dairy', label: 'Dairy & Eggs', icon: '🥛', color: '#f0f9ff',
    subs: ['Desi Bilona Ghee', 'Paneer', 'Brown Eggs'],
    wcName: 'Dairy' },
  { id: 'teas', label: 'Herbal Teas', icon: '🍵', color: '#f0fdf4',
    subs: ['Assam CTC Tea', 'Premium Assam Tea', 'Herbal Infusions'],
    wcName: 'Beverages' },
]

function MiniProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="flex items-center gap-2.5 hover:bg-stone-50 rounded-lg p-2 transition-colors group">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-50 shrink-0">
        {product.images[0] ? (
          <Image src={product.images[0].src} alt={product.name} fill className="object-cover" sizes="48px" />
        ) : (
          <div className="w-full h-full bg-primary-50 flex items-center justify-center text-sm">🌿</div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-bark truncate group-hover:text-primary transition-colors">{product.name}</p>
        <p className="text-xs text-primary font-semibold">₹{product.price}</p>
      </div>
    </Link>
  )
}

export default function Header() {
  const router = useRouter()
  const { state: cartState } = useCart()
  const { count: wishCount } = useWishlist()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [wcCategories, setWcCategories] = useState<Category[]>([])
  const [megaProducts, setMegaProducts] = useState<Record<string, Product[]>>({})
  const [megaLoading, setMegaLoading] = useState<Record<string, boolean>>({})
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setActiveMega(null)
  }, [router.asPath])

  // Fetch WC categories once for ID lookup
  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setWcCategories(data)
    }).catch(() => {})
  }, [])

  const fetchMegaProducts = useCallback(async (catId: string, wcName: string) => {
    if (megaProducts[catId] || megaLoading[catId]) return
    const match = wcCategories.find(c =>
      c.name.toLowerCase().includes(wcName.toLowerCase()) ||
      wcName.toLowerCase().includes(c.name.toLowerCase())
    )
    if (!match) return
    setMegaLoading(prev => ({ ...prev, [catId]: true }))
    try {
      const res = await fetch(`/api/products?category=${match.id}&per_page=3`)
      const data = await res.json()
      setMegaProducts(prev => ({ ...prev, [catId]: Array.isArray(data) ? data : [] }))
    } catch {}
    setMegaLoading(prev => ({ ...prev, [catId]: false }))
  }, [megaProducts, megaLoading, wcCategories])

  const handleCatEnter = (cat: MegaCat) => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current)
    setActiveMega(cat.id)
    if (wcCategories.length > 0) fetchMegaProducts(cat.id, cat.wcName)
  }

  const handleMegaLeave = () => {
    leaveTimeout.current = setTimeout(() => setActiveMega(null), 180)
  }

  const handleMegaEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current)
  }

  const activeCat = MEGA_CATS.find(c => c.id === activeMega)

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-bark/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Image
                src="/LOGO ORGANIC.svg"
                alt="Organic Options"
                width={180}
                height={72}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-bark/50 hover:text-bark p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Nav links */}
          <div className="border-b border-stone-100 pb-4 mb-4 space-y-1">
            {[{ href: '/shop', label: 'Shop All' }, { href: '/farm-stays', label: 'Farm Stays' }, { href: '/farm-experience', label: 'Farm Courses' }, { href: '/about', label: 'About Us' }, { href: '/contact', label: 'Contact' }].map(l => (
              <Link key={l.href} href={l.href} className="block py-2.5 px-3 text-sm font-medium text-bark hover:text-primary hover:bg-primary-50 rounded-lg transition-colors">{l.label}</Link>
            ))}
          </div>
          {/* Categories */}
          <p className="text-[10px] font-bold text-bark/40 uppercase tracking-widest mb-2 px-3">Categories</p>
          <div className="space-y-1 mb-6">
            {MEGA_CATS.map(cat => (
              <Link key={cat.id} href={`/shop?category=${cat.wcName.toLowerCase()}`} className="flex items-center gap-2.5 py-2 px-3 text-sm text-bark hover:text-primary hover:bg-primary-50 rounded-lg transition-colors">
                <span>{cat.icon}</span><span>{cat.label}</span>
              </Link>
            ))}
          </div>
          {/* Contact */}
          <div className="border-t border-stone-100 pt-4 text-xs text-bark/50 space-y-1">
            <p>📞 +91 63640 20233</p>
            <p>✉️ organicoptionsblr@gmail.com</p>
          </div>
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-40">
        {/* Main nav bar — white, single row */}
        <div className="bg-white border-b border-stone-100 h-24 flex items-center shadow-sm">
          <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/LOGO ORGANIC.svg"
                alt="Organic Options"
                width={240}
                height={96}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>

            {/* Center nav links */}
            <nav className="hidden md:flex items-center gap-7">
              <Link href="/shop" className="nav-link">Shop</Link>
              <Link href="/farm-box" className="nav-link">Farm Box</Link>
              <Link href="/farm-stays" className="nav-link">Farm Stays</Link>
              <Link href="/farm-experience" className="nav-link">Farm Courses</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)} className="p-2 text-bark/60 hover:text-primary transition-colors" aria-label="Search">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {/* Account */}
              <Link href="/my-account" className="hidden sm:flex items-center gap-1 px-2 py-1 text-bark/60 hover:text-primary text-xs transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Account</span>
              </Link>
              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 text-bark/60 hover:text-primary transition-colors" aria-label="Wishlist">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] rounded-full flex items-center justify-center font-bold">{wishCount}</span>
                )}
              </Link>
              {/* Track order */}
              <Link href="/my-account/orders" className="hidden md:flex items-center gap-1 px-2 py-1 text-bark/60 hover:text-primary text-xs transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Track Order</span>
              </Link>
              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-bark/60 hover:text-primary transition-colors" aria-label="Cart">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] rounded-full flex items-center justify-center font-bold">{cartState.itemCount}</span>
                )}
              </Link>
              {/* Hamburger (mobile) */}
              <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 text-bark/60 hover:text-primary" aria-label="Menu">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* TIER 3 — Category mega-menu bar */}
        <div className="bg-primary hidden md:block relative z-30" onMouseLeave={handleMegaLeave}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-evenly w-full">
              {MEGA_CATS.map(cat => (
                <div key={cat.id} onMouseEnter={() => handleCatEnter(cat)}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat.wcName)}`}
                    className={`flex items-center h-11 px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                      activeMega === cat.id
                        ? 'text-white bg-primary-700'
                        : 'text-white/80 hover:text-white hover:bg-primary-700'
                    }`}
                  >
                    {cat.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mega dropdown */}
          {activeCat && (
            <div
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t-4 border-primary z-50"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-8">
                {/* Left: Subcategories */}
                <div>
                  <p className="text-xs font-bold text-bark/40 uppercase tracking-widest mb-3">{activeCat.label}</p>
                  <ul className="space-y-1">
                    {activeCat.subs.map(sub => (
                      <li key={sub}>
                        <Link
                          href={`/shop?search=${encodeURIComponent(sub)}`}
                          className="block py-1.5 text-sm text-bark/70 hover:text-primary transition-colors hover:pl-1"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={`/shop?category=${encodeURIComponent(activeCat.wcName)}`} className="block pt-2 text-sm font-semibold text-primary hover:underline">
                        View all {activeCat.label} →
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Middle: Featured products */}
                <div>
                  <p className="text-xs font-bold text-bark/40 uppercase tracking-widest mb-3">Popular in {activeCat.label}</p>
                  {megaLoading[activeCat.id] ? (
                    <div className="space-y-1">
                      <MiniProductCardSkeleton />
                      <MiniProductCardSkeleton />
                      <MiniProductCardSkeleton />
                    </div>
                  ) : (megaProducts[activeCat.id] || []).length > 0 ? (
                    <div className="space-y-1">
                      {(megaProducts[activeCat.id] || []).slice(0, 3).map(p => (
                        <MiniProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-bark/40 py-4">Browse all products →</div>
                  )}
                </div>
                {/* Right: CTA */}
                <div className="rounded-2xl flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: activeCat.color }}>
                  <span className="text-6xl mb-3">{activeCat.icon}</span>
                  <h3 className="font-serif font-semibold text-bark text-lg mb-1">{activeCat.label}</h3>
                  <p className="text-bark/60 text-xs mb-4">Fresh from our organic farms, certified and delivered to your door.</p>
                  <Link
                    href={`/shop?category=${encodeURIComponent(activeCat.wcName)}`}
                    className="btn-sm"
                    onClick={() => setActiveMega(null)}
                  >
                    Shop {activeCat.label}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
