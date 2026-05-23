import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '@/components/layout/Layout'

export default function OrderConfirmationPage() {
  const { query } = useRouter()
  const orderId = query.orderId as string
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <Layout title="Order Confirmed" noindex>
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Animated checkmark */}
        <div
          className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-700 ${
            visible ? 'bg-primary scale-100 opacity-100' : 'bg-primary scale-50 opacity-0'
          }`}
        >
          <svg
            className={`w-12 h-12 text-white transition-all duration-500 delay-300 ${
              visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className={`transition-all duration-500 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="font-serif text-4xl font-semibold text-bark mb-3">Order Confirmed!</h1>
          {orderId && (
            <p className="text-bark/50 text-sm mb-2">
              Order <span className="font-mono font-semibold text-bark">#{orderId}</span>
            </p>
          )}
          <p className="text-bark/70 text-base leading-relaxed mb-10 max-w-md mx-auto">
            Thank you for choosing Organic Options. We&apos;ll pack your order fresh from our farm and dispatch it within 1–2 business days.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
                title: 'Packed Fresh',
                desc: 'Your order is packed with care directly from our farm.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ),
                title: '3–5 Day Delivery',
                desc: 'Expected delivery within 3–5 business days.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Tracking SMS',
                desc: "You'll receive tracking details via SMS & email.",
              },
            ].map(s => (
              <div key={s.title} className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto mb-3">
                  {s.icon}
                </div>
                <p className="font-semibold text-bark text-sm mb-1">{s.title}</p>
                <p className="text-bark/50 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
            <Link href="/my-account/orders" className="btn-outline">View My Orders</Link>
          </div>

          <p className="text-bark/40 text-sm">
            Need help? Call{' '}
            <a href="tel:+916364020233" className="text-primary hover:underline">+91 63640 20233</a>
            {' '}or email{' '}
            <a href="mailto:organicoptionsblr@gmail.com" className="text-primary hover:underline">organicoptionsblr@gmail.com</a>
          </p>
        </div>
      </div>
    </Layout>
  )
}
