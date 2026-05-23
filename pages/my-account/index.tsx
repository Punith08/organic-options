import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'

interface User { email: string; name: string; token: string }

export default function MyAccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oo_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      const userData = { ...data.user, token: data.token }
      localStorage.setItem('oo_user', JSON.stringify(userData))
      setUser(userData)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('oo_user')
    setUser(null)
  }

  if (user) {
    return (
      <Layout title="My Account">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-bark">My Account</h1>
              <p className="text-bark/50 text-sm mt-1">Welcome back, <span className="font-medium text-bark">{user.name}</span></p>
            </div>
            <button onClick={handleLogout} className="text-sm text-bark/40 hover:text-bark transition-colors">
              Sign out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              {
                href: '/my-account/orders',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'My Orders',
                desc: 'View and track your orders',
              },
              {
                href: '/wishlist',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Wishlist',
                desc: 'Your saved products',
              },
              {
                href: '/shop',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
                title: 'Shop Now',
                desc: 'Browse organic products',
              },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="card p-6 flex items-center gap-4 group hover:border-primary"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-bark text-sm group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-bark/50 text-xs mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="card p-6 text-sm text-bark/70">
            <h3 className="font-semibold text-bark mb-3">Account Details</h3>
            <p className="mb-1"><span className="text-bark/50">Email:</span> {user.email}</p>
            <p className="text-bark/50 text-xs mt-3">
              For account changes, contact us at{' '}
              <a href="mailto:organicoptionsblr@gmail.com" className="text-primary hover:underline">organicoptionsblr@gmail.com</a>
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Sign In" noindex>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Sign In</h1>
          <p className="text-bark/50 text-sm">Access your account, orders and wishlist.</p>
        </div>

        <form onSubmit={handleLogin} className="card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-bark/70 mb-1.5">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="you@example.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bark/70 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              placeholder="••••••••"
              className="input-field"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-xs text-bark/40">
            Don&apos;t have an account?{' '}
            <a href="mailto:organicoptionsblr@gmail.com" className="text-primary hover:underline">
              Contact us to set one up
            </a>
          </p>
        </form>
      </div>
    </Layout>
  )
}
