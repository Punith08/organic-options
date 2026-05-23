import Link from 'next/link'
import Layout from '@/components/layout/Layout'

export default function ReturnsPage() {
  return (
    <Layout title="Returns & Refunds" description="Organic Options returns and refund policy.">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Returns &amp; Refunds</h1>
        <p className="text-bark/50 mb-10">We stand behind the quality of every product we sell. If something isn&apos;t right, we&apos;ll make it right.</p>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-semibold text-bark mb-3">Eligibility for Returns</h2>
            <p className="text-bark/60 text-sm leading-relaxed mb-3">We accept returns within <strong>7 days of delivery</strong> for the following reasons:</p>
            <ul className="space-y-2 text-sm text-bark/60">
              {['Product is damaged or defective', 'Wrong item delivered', 'Product is significantly different from description', 'Quality issue (e.g., contamination, unusual odour)'].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-bark/50 text-xs mt-4">Note: Returns are not accepted for change of mind or opened perishable products.</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-semibold text-bark mb-3">How to Initiate a Return</h2>
            <ol className="space-y-3 text-sm text-bark/60">
              {[
                'Email us at organicoptionsblr@gmail.com with your order ID and a clear description of the issue.',
                'Attach photos of the product and packaging.',
                'Our team will review your request within 1–2 business days.',
                'If approved, we\'ll arrange a pickup or ask you to dispatch the item back.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary text-xs font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-semibold text-bark mb-3">Refunds</h2>
            <p className="text-bark/60 text-sm leading-relaxed">
              Once your return is received and inspected, we will process a refund to your original payment method within <strong>5–7 business days</strong>. You will receive an email confirmation once the refund is issued.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-semibold text-bark mb-3">Replacements</h2>
            <p className="text-bark/60 text-sm leading-relaxed">
              In many cases, we can arrange a direct replacement rather than a refund, which may be faster. Let us know your preference when you contact us.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href="mailto:organicoptionsblr@gmail.com?subject=Return Request" className="btn-primary">Email Us About a Return</a>
          <Link href="/contact" className="btn-outline">Contact Page</Link>
        </div>
      </div>
    </Layout>
  )
}
