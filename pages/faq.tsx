import { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'

const FAQS = [
  {
    section: 'About Our Products',
    items: [
      {
        q: 'Are your products certified organic?',
        a: 'Yes. All our products are grown on our certified organic farm and are FSSAI certified (Lic. No. 21224000001072). We never use synthetic pesticides, chemical fertilisers, or GMOs.',
      },
      {
        q: 'Are products lab-tested?',
        a: 'Yes. We send samples to accredited third-party labs to test for pesticide residues, heavy metals, and nutritional quality before products are sold.',
      },
      {
        q: 'Do you source from other farms?',
        a: 'No — everything we sell is grown on our own farm in Karnataka. We do not source from third-party farms, so we can guarantee the quality and provenance of every product.',
      },
    ],
  },
  {
    section: 'Orders & Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'We dispatch within 1–2 business days of receiving your order. Delivery typically takes 3–5 business days across India.',
      },
      {
        q: 'Is there a minimum order amount?',
        a: 'No minimum order. However, free shipping applies on orders above ₹999. Below that, a flat ₹80 shipping charge applies.',
      },
      {
        q: 'Do you deliver Pan-India?',
        a: 'Yes, we deliver to all major cities and towns across India via our logistics partners.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. You will receive an SMS with tracking details once your order is dispatched. You can also use the track order page on our website.',
      },
    ],
  },
  {
    section: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for damaged, defective, or incorrect items. Please email us at organicoptionsblr@gmail.com with your order ID and photos.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Refunds are processed within 5–7 business days to your original payment method after we receive and verify the returned item.',
      },
    ],
  },
  {
    section: 'Farm Box',
    items: [
      {
        q: 'What is the Farm Box?',
        a: 'The Farm Box is a seasonal subscription box containing 6 curated organic items — grains, pulses, oils, spices, herbal teas, and a seasonal surprise — at ₹999 per session.',
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes. You can cancel your Farm Box subscription at any time by emailing us before your next dispatch date.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between py-4 text-left gap-4"
      >
        <span className="font-medium text-bark text-sm leading-relaxed">{q}</span>
        <svg
          className={`w-4 h-4 text-primary shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4 text-bark/60 text-sm leading-relaxed">{a}</div>}
    </div>
  )
}

export default function FAQPage() {
  return (
    <Layout title="FAQ" description="Frequently asked questions about Organic Options products, delivery, and returns.">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Frequently Asked Questions</h1>
        <p className="text-bark/50 mb-10">Can&apos;t find what you&apos;re looking for? <a href="mailto:organicoptionsblr@gmail.com" className="text-primary hover:underline">Email us</a>.</p>

        <div className="space-y-10">
          {FAQS.map(section => (
            <div key={section.section}>
              <h2 className="font-semibold text-bark text-xs uppercase tracking-widest mb-4 text-primary">{section.section}</h2>
              <div className="bg-white rounded-2xl border border-stone-100 px-6">
                {section.items.map(item => <FAQItem key={item.q} {...item} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 rounded-2xl p-7 text-center">
          <h3 className="font-serif font-semibold text-bark mb-2">Still have questions?</h3>
          <p className="text-bark/50 text-sm mb-5">Our team is happy to help — Mon to Sat, 9 AM to 6 PM.</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <a href="tel:+916364020233" className="btn-sm">Call +91 63640 20233</a>
            <Link href="/contact" className="btn-outline text-sm px-5 py-2.5">Send a Message</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
