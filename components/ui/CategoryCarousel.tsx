import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/types/product'

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
}

interface Props {
  categories: Category[]
}

export default function CategoryCarousel({ categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    // Defer so layout is painted before measuring
    const id = requestAnimationFrame(updateScrollState)
    return () => cancelAnimationFrame(id)
  }, [categories, updateScrollState])

  // Auto-scroll every 4 seconds, pause on hover
  useEffect(() => {
    if (isHovered) return
    const id = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: 176, behavior: 'smooth' }) // 160px card + 16px gap
      }
    }, 4000)
    return () => clearInterval(id)
  }, [isHovered])

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -352, behavior: 'smooth' }) // 2 cards
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 352, behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
            BROWSE THE RANGE
          </p>
          <h2 className="font-serif font-semibold text-4xl text-bark leading-tight">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-primary text-sm font-medium hover:underline hidden md:block"
        >
          View all →
        </Link>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left arrow */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-200"
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
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-stone-100 shadow-sm hover:border-primary hover:scale-105 transition-all duration-200 flex-shrink-0"
              style={{ width: '160px', scrollSnapAlign: 'start' }}
            >
              {cat.image ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={cat.image.src}
                    alt={cat.image.alt || decodeHtml(cat.name)}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
                  <svg
                    className="w-9 h-9 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              )}
              <span className="font-sans text-xs font-medium text-bark text-center leading-tight group-hover:text-primary transition-colors">
                {decodeHtml(cat.name)}
              </span>
            </Link>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-200"
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
