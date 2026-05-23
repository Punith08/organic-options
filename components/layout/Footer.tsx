import Link from 'next/link'
import { useState } from 'react'

const shopLinks = [
  { label: 'All Products', href: '/shop' },
  { label: 'Fruits & Vegetables', href: '/shop?category=fruits-vegetables' },
  { label: 'Grains & Flours', href: '/shop?category=grains-flours' },
  { label: 'Pulses & Lentils', href: '/shop?category=pulses-lentils' },
  { label: 'Cold-Pressed Oils', href: '/shop?category=oils' },
  { label: 'Spices & Masalas', href: '/shop?category=spices' },
  { label: 'Rice & Millets', href: '/shop?category=rice-millets' },
  { label: 'Natural Sweeteners', href: '/shop?category=sweeteners' },
  { label: 'Farm Box', href: '/farm-box' },
]

const companyLinks = [
  { label: 'Our Story', href: '/about' },
  { label: 'Farm Experience', href: '/farm-experience' },
  { label: 'Blog & Recipes', href: '/blog' },
  { label: 'Sustainability', href: '/about#sustainability' },
  { label: 'Certifications', href: '/about#certifications' },
]

const helpLinks = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Delivery Information', href: '/delivery-info' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Track Your Order', href: '/track-order' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-bark text-white/80">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif font-bold text-2xl text-white tracking-tight">
                Organic<span className="text-primary-400">Options</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Straight from our family farm to your table. Certified organic produce grown with love on the Nilgiri foothills since 2009.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 mb-5">
              <svg className="w-5 h-5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">FSSAI Certified</p>
                <p className="text-xs text-white/70 font-medium">Lic. No. 21224000001072</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <a href="tel:+916364020233" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 63640 20233
              </a>
              <a href="tel:+918050459000" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 80504 59000
              </a>
              <a href="mailto:organicoptionsblr@gmail.com" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                organicoptionsblr@gmail.com
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 4: Help */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Help</h4>
            <ul className="space-y-3">
              {helpLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-serif text-xl font-medium mb-1">Get farm-fresh updates</h4>
              <p className="text-white/50 text-sm">Seasonal recipes, harvest news and exclusive offers — no spam, ever.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-primary-400 font-medium text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You&apos;re on the list!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 md:w-64 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-primary-400 transition-colors"
                />
                <button type="submit" className="shrink-0 bg-primary hover:bg-primary-700 text-white rounded-full px-6 py-2.5 text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Organic Options Farms Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              FSSAI Certified
            </span>
            <span>|</span>
            <span>GST Registered</span>
            <span>|</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secured by Razorpay
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
