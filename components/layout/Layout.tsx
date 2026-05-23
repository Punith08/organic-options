import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  ogImage?: string
  noindex?: boolean
}

export default function Layout({ children, title, description, ogImage, noindex }: LayoutProps) {
  const siteTitle = title ? `${title} | Organic Options` : 'Organic Options — Purity, You Can Trust'
  const siteDesc = description || 'Certified organic products direct from our farm — grains, spices, oils, fresh produce and more. Free delivery above ₹499.'
  const ogImg = ogImage || '/og-default.jpg'

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:site_name" content="Organic Options" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDesc} />
        <meta name="twitter:image" content={ogImg} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 md:pt-[140px]">{children}</main>
        <Footer />
      </div>
    </>
  )
}
