import Layout from '@/components/layout/Layout'

export default function TermsPage() {
  return (
    <Layout title="Terms & Conditions">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Terms &amp; Conditions</h1>
        <p className="text-bark/40 text-xs mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
        <div className="prose prose-sm max-w-none text-bark/70 space-y-6">
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Product Availability</h2>
            <p>All products are subject to availability. We reserve the right to discontinue or modify products at any time. In case of out-of-stock items after payment, we will notify you and issue a full refund.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Pricing</h2>
            <p>Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. Prices are subject to change without prior notice. The price charged at the time of checkout is final.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Orders</h2>
            <p>By placing an order, you represent that you are at least 18 years of age and that the information you provide is accurate. We reserve the right to cancel orders at our discretion.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Intellectual Property</h2>
            <p>All content on this website — including text, images, and logos — is the property of Organic Options Farms and may not be used without written permission.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Governing Law</h2>
            <p>These terms are governed by the laws of Karnataka, India. Any disputes arising from the use of this website or purchase of products shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Contact</h2>
            <p>For queries about these terms, contact <a href="mailto:organicoptionsblr@gmail.com" className="text-primary">organicoptionsblr@gmail.com</a> or call <a href="tel:+916364020233" className="text-primary">+91 63640 20233</a>.</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
