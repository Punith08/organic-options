import Layout from '@/components/layout/Layout'

export default function PrivacyPolicyPage() {
  return (
    <Layout title="Privacy Policy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Privacy Policy</h1>
        <p className="text-bark/40 text-xs mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
        <div className="prose prose-sm max-w-none text-bark/70 space-y-6">
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Information We Collect</h2>
            <p>We collect your name, email address, phone number, and shipping address when you place an order. This information is used solely for order fulfillment and communication.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">How We Use Your Data</h2>
            <p>Your personal information is used to process orders, send order confirmations, provide delivery updates, and respond to your queries. We do not use your data for marketing without consent.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal data to third parties. We share only what is necessary with shipping partners (Shiprocket) to fulfill your delivery.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Payment Security</h2>
            <p>All payment transactions are processed by Razorpay. We do not store any payment card details. Razorpay is PCI-DSS compliant and handles all payment data securely.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Cookies</h2>
            <p>We use local storage to maintain your shopping cart. We do not use third-party tracking cookies.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal data. Contact us at <a href="mailto:organicoptionsblr@gmail.com" className="text-primary">organicoptionsblr@gmail.com</a> for any data requests.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Contact</h2>
            <p>For privacy concerns, contact: Organic Options Farms, No. 53, 2nd Main, 2nd Stage, Nandini Layout, Bengaluru — <a href="mailto:organicoptionsblr@gmail.com" className="text-primary">organicoptionsblr@gmail.com</a></p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
