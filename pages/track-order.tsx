import { useState } from 'react'
import Layout from '@/components/layout/Layout'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Layout title="Track Your Order" description="Track your Organic Options order.">
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Track Your Order</h1>
          <p className="text-bark/50 text-sm">Enter your order details to check status.</p>
        </div>

        {submitted ? (
          <div className="card p-8 text-center">
            <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-serif font-semibold text-bark mb-2">We&apos;re looking that up!</h2>
            <p className="text-bark/50 text-sm mb-5">
              We&apos;ll send tracking details for order <span className="font-mono font-semibold text-bark">#{orderId}</span> to <strong>{email}</strong> shortly.
            </p>
            <p className="text-bark/40 text-xs">
              For immediate assistance, call{' '}
              <a href="tel:+916364020233" className="text-primary hover:underline">+91 63640 20233</a>
            </p>
            <button onClick={() => { setSubmitted(false); setOrderId(''); setEmail('') }} className="btn-outline text-sm mt-6 px-5 py-2">
              Track Another Order
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1.5">Order ID *</label>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                required
                placeholder="e.g. 12345"
                className="input-field"
              />
              <p className="text-bark/40 text-xs mt-1">Found in your order confirmation email or SMS.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1.5">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Track Order</button>
            <p className="text-center text-xs text-bark/40">
              Need help?{' '}
              <a href="tel:+916364020233" className="text-primary hover:underline">Call +91 63640 20233</a>
            </p>
          </form>
        )}
      </div>
    </Layout>
  )
}
