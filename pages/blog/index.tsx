import type { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/layout/Layout'

interface WpPost {
  id: number
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string }
  date: string
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
  }
}

interface Props { posts: WpPost[] }

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const res = await fetch('https://organicoptionsfarms.com/wp-json/wp/v2/posts?per_page=12&_embed')
    if (!res.ok) return { props: { posts: [] }, revalidate: 3600 }
    const posts: WpPost[] = await res.json()
    return { props: { posts }, revalidate: 3600 }
  } catch {
    return { props: { posts: [] }, revalidate: 3600 }
  }
}

export default function BlogPage({ posts }: Props) {
  return (
    <Layout title="Blog" description="Organic living tips, farm stories, and healthy recipes from Organic Options Farms.">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-2">From the Farm</h1>
        <p className="text-bark/50 mb-10">Stories, tips, and recipes from our organic farm.</p>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-bark/40">
            <p className="text-5xl mb-4">📰</p>
            <p>No posts found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => {
              const imgUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
              const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim().slice(0, 120)
              const date = new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="card group block">
                  <div className="relative h-48 bg-stone-50 overflow-hidden">
                    {imgUrl ? (
                      <Image src={imgUrl} alt={post.title.rendered} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-bark/40 text-xs mb-2">{date}</p>
                    <h2 className="font-serif font-semibold text-bark text-base leading-snug mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <p className="text-bark/60 text-sm line-clamp-3">{excerpt}…</p>
                    <p className="text-primary text-sm font-medium mt-3 group-hover:underline">Read More →</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
