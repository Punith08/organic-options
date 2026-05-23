import type { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'

interface WpPost {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  date: string
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
  }
}

interface Props { post: WpPost }

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch('https://organicoptionsfarms.com/wp-json/wp/v2/posts?per_page=100')
    if (!res.ok) return { paths: [], fallback: 'blocking' }
    const posts: WpPost[] = await res.json()
    return { paths: posts.map(p => ({ params: { slug: p.slug } })), fallback: 'blocking' }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const slug = params?.slug as string
    const res = await fetch(`https://organicoptionsfarms.com/wp-json/wp/v2/posts?slug=${slug}&_embed`)
    if (!res.ok) return { notFound: true }
    const posts: WpPost[] = await res.json()
    if (!posts.length) return { notFound: true }
    return { props: { post: posts[0] }, revalidate: 3600 }
  } catch {
    return { notFound: true }
  }
}

export default function BlogPostPage({ post }: Props) {
  const imgUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const date = new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <Layout title={post.title.rendered.replace(/<[^>]+>/g, '')}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blog" className="text-primary text-sm hover:underline flex items-center gap-1 mb-6">
          ← Back to Blog
        </Link>
        {imgUrl && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image src={imgUrl} alt={post.title.rendered} fill className="object-cover" priority />
          </div>
        )}
        <p className="text-bark/40 text-xs mb-3">{date}</p>
        <h1
          className="font-serif text-3xl font-semibold text-bark mb-8 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div
          className="prose prose-sm max-w-none text-bark/80"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        <div className="mt-10 pt-6 border-t border-stone-100">
          <Link href="/blog" className="text-primary text-sm hover:underline">← Back to Blog</Link>
        </div>
      </div>
    </Layout>
  )
}
