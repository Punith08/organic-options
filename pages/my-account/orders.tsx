import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'

interface User { email: string; name: string; token: string }

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oo_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
  }, [])

  return (
    <Layout title="My Orders">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/my-account" className="text-bark/40 hover:text-bark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-serif text-3xl font-semibold text-bark">My Orders</h1>
        </div>

        {/* Track by order ID */}
        <div className="card p-7 mb-8">
          <h2 className="font-semibold text-bark mb-1">Track an Order</h2>
          <p className="text-bark/50 text-sm mb-4">Enter your order ID to check the status.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="Order ID (e.g. 12345)"
              className="input-field flex-1"
            />
            <Link
              href={orderId ? `/order-confirmation?orderId=${orderId}` : '#'}
              className={`btn-sm shrink-0 ${!orderId ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Track
            </Link>
          </div>
        </div>

        {/* Contact support */}
        <div className="bg-primary-50 rounded-2xl p-7">
          <h2 className="font-semibold text-bark mb-2">Need help with an order?</h2>
          <p className="text-bark/60 text-sm mb-5">
            {user
              ? `We'll look up orders for ${user.email}. Reach out and we'll get back to you promptly.`
              : 'Contact us with your order ID and we\'ll get back to you promptly.'}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="tel:+916364020233" className="flex items-center gap-2 text-primary font-medium hover:underline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 63640 20233
            </a>
            <a href="mailto:organicoptionsblr@gmail.com" className="flex items-center gap-2 text-primary font-medium hover:underline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              organicoptionsblr@gmail.com
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}
