'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { Product } from '@/types/product'

interface Props {
  products: Product[]
  title: string
  subtitle?: string
  badge?: string
  viewAllHref?: string
  viewAllLabel?: string
}

export default function ProductCarousel({ products, title, subtitle, badge, viewAllHref = '/shop', viewAllLabel = 'View All →' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(updateScrollState)
    return () => cancelAnimationFrame(id)
  }, [products, updateScrollState])

  const scrollBy = (dir: number) =>
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })

  if (!products.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          {badge && <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{badge}</p>}
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-bark/50 text-sm mt-1">{subtitle}</p>}
        </div>
        <Link href={viewAllHref} className="text-sm text-primary font-medium hover:underline hidden sm:block shrink-0 ml-4">
          {viewAllLabel}
        </Link>
      </div>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-8 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-200"
          style={{ opacity: canScrollLeft ? 1 : 0, pointerEvents: canScrollLeft ? 'auto' : 'none' }}
        >
          <svg className="w-5 h-5 text-bark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map(product => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[200px] sm:w-[230px] lg:w-[260px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-8 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-200"
          style={{ opacity: canScrollRight ? 1 : 0, pointerEvents: canScrollRight ? 'auto' : 'none' }}
        >
          <svg className="w-5 h-5 text-bark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
