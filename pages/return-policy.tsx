import Layout from '@/components/layout/Layout'

export default function ReturnPolicyPage() {
  return (
    <Layout title="Return Policy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-8">Return Policy</h1>
        <div className="prose prose-sm max-w-none text-bark/70 space-y-6">
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">7-Day Return Window</h2>
            <p>We accept returns on non-perishable items within 7 days of delivery, provided the item is unused and in its original packaging.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Non-Returnable Items</h2>
            <p>Due to hygiene and quality reasons, we do not accept returns on fresh produce, perishable goods, or opened food items.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Return Conditions</h2>
            <p>Items must be unused, unopened, and in the same condition you received them. The original packaging must be intact.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">How to Initiate a Return</h2>
            <p>Email us at <a href="mailto:organicoptionsblr@gmail.com" className="text-primary">organicoptionsblr@gmail.com</a> with your order ID and reason for return. We will guide you through the process.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Refunds</h2>
            <p>Once your return is received and inspected, your refund will be processed within 5–7 business days to your original payment method.</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
