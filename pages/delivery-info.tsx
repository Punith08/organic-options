import Link from 'next/link'
import Layout from '@/components/layout/Layout'

export default function DeliveryInfoPage() {
  return (
    <Layout title="Delivery Information" description="Shipping and delivery details for Organic Options orders.">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Delivery Information</h1>
        <p className="text-bark/50 mb-10">Everything you need to know about how we get your organic order to you.</p>

        <div className="space-y-8">
          {[
            {
              title: 'Dispatch Time',
              content: 'We dispatch all orders within 1–2 business days of confirmed payment. Orders placed before 12 PM are usually dispatched the same day.',
            },
            {
              title: 'Delivery Time',
              content: 'Delivery takes 3–5 business days across India after dispatch. Metro cities typically receive orders in 2–3 days.',
            },
            {
              title: 'Shipping Charges',
              content: 'Free shipping on all orders above ₹999. For orders below ₹999, a flat shipping charge of ₹80 applies.',
            },
            {
              title: 'Delivery Partners',
              content: 'We use trusted logistics partners including Shiprocket-powered carriers (DTDC, Blue Dart, Delhivery, and others) to ensure safe and timely delivery.',
            },
            {
              title: 'Order Tracking',
              content: 'Once your order is dispatched, you\'ll receive an SMS with a tracking link. You can also track your order using the Track Order page.',
            },
            {
              title: 'Delivery Areas',
              content: 'We deliver Pan-India to all major cities, towns, and most pincodes. If you\'re unsure about delivery to your area, contact us before placing your order.',
            },
            {
              title: 'Damaged in Transit',
              content: 'In the rare event that your order arrives damaged, please photograph the package and contents and email us within 48 hours. We\'ll arrange a replacement or refund.',
            },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-stone-100 p-6">
              <h2 className="font-semibold text-bark mb-2">{item.title}</h2>
              <p className="text-bark/60 text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/track-order" className="btn-primary">Track an Order</Link>
          <Link href="/contact" className="btn-outline">Contact Support</Link>
        </div>
      </div>
    </Layout>
  )
}
