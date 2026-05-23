import Layout from '@/components/layout/Layout'
import Link from 'next/link'
export default function NotFound() {
  return (
    <Layout title="Page Not Found">
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-8xl font-serif font-bold text-primary-100 mb-4">404</p>
        <h1 className="font-serif text-3xl font-semibold text-bark mb-3">Page not found</h1>
        <p className="text-bark/50 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/shop" className="btn-outline">Shop Now</Link>
        </div>
      </div>
    </Layout>
  )
}
