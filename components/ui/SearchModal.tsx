import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'

interface Props { isOpen: boolean; onClose: () => void }

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oo_recent_searches')
      if (saved) setRecent(JSON.parse(saved).slice(0, 5))
    } catch {}
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&per_page=8`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch { setResults([]) }
    setLoading(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 300)
  }

  const handleSelect = (term: string) => {
    const updated = [term, ...recent.filter(r => r !== term)].slice(0, 5)
    setRecent(updated)
    try { localStorage.setItem('oo_recent_searches', JSON.stringify(updated)) } catch {}
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSelect(query.trim())
      window.location.href = `/shop?search=${encodeURIComponent(query.trim())}`
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      <div className="absolute inset-0 bg-bark/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full shadow-2xl" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 border-2 border-primary rounded-2xl px-4 py-3 bg-white">
            <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              placeholder="Search for organic products..."
              className="flex-1 text-base text-bark placeholder-bark/40 outline-none bg-transparent"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }} className="text-bark/40 hover:text-bark">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button type="button" onClick={onClose} className="text-bark/40 hover:text-bark ml-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          {/* Recent searches */}
          {!query && recent.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-bark/40 uppercase tracking-widest mb-2">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recent.map(r => (
                  <button key={r} onClick={() => { setQuery(r); doSearch(r) }} className="text-sm bg-stone-100 hover:bg-primary-50 hover:text-primary px-3 py-1.5 rounded-full transition-colors">
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-stone-200 rounded-xl mb-2" />
                  <div className="h-3 bg-stone-200 rounded-full mb-1" />
                  <div className="h-3 w-2/3 bg-stone-200 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-bark/40 uppercase tracking-widest mb-3">{results.length} results for &quot;{query}&quot;</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.map(p => (
                  <Link key={p.id} href={`/product/${p.slug}`} onClick={() => handleSelect(query)} className="group text-center">
                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-50 mb-2 relative">
                      {p.images[0] ? (
                        <Image src={p.images[0].src} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="150px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-primary-50">🌿</div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-bark leading-snug line-clamp-2">{p.name}</p>
                    <p className="text-xs font-semibold text-primary mt-0.5">₹{p.price}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href={`/shop?search=${encodeURIComponent(query)}`} onClick={() => handleSelect(query)} className="text-primary text-sm font-medium hover:underline">
                  View all results for &quot;{query}&quot; →
                </Link>
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && query && results.length === 0 && (
            <div className="mt-8 text-center text-bark/50">
              <p className="text-sm">No products found for &quot;{query}&quot;</p>
              <Link href="/shop" onClick={onClose} className="text-primary text-sm font-medium hover:underline mt-2 block">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
