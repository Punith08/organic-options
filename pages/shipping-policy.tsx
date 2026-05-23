import Layout from '@/components/layout/Layout'

export default function ShippingPolicyPage() {
  return (
    <Layout title="Shipping Policy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-8">Shipping Policy</h1>
        <div className="prose prose-sm max-w-none text-bark/70 space-y-6">
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Free Delivery</h2>
            <p>We offer free delivery on all orders above ₹999. Orders below ₹999 attract a flat shipping fee of ₹80.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Standard Delivery</h2>
            <p>Standard delivery takes 3–5 business days from the date of dispatch. You will receive a tracking SMS once your order is dispatched.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Express Delivery (Bengaluru)</h2>
            <p>Express delivery within 24–48 hours is available for orders within Bengaluru. Please contact us to arrange express delivery.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Eco-Friendly Packaging</h2>
            <p>All products are packed in eco-friendly, recyclable materials to minimize environmental impact while keeping your products fresh and safe.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Delivery Restrictions</h2>
            <p>We currently do not deliver to PO Boxes. A valid street address is required for all deliveries. We ship within India only.</p>
          </section>
          <section>
            <h2 className="font-serif font-semibold text-bark text-lg mb-2">Contact</h2>
            <p>For shipping queries, contact us at <a href="mailto:organicoptionsblr@gmail.com" className="text-primary">organicoptionsblr@gmail.com</a> or call <a href="tel:+916364020233" className="text-primary">+91 63640 20233</a>.</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
