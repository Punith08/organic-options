import { useState } from 'react'
import Image from 'next/image'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types/product'

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Box',
    tagline: 'Perfect for 1–2 people',
    monthlyPrice: 999,
    fortnightlyPrice: 1199,
    sku: 'FARM-BOX-BASIC',
    highlight: false,
    items: [
      { name: 'Organic Grains & Millets', qty: '2 kg' },
      { name: 'Organic Pulses', qty: '500 g' },
      { name: 'Cold-Pressed Oil', qty: '500 ml' },
      { name: 'Whole Spices Mix', qty: '100 g' },
      { name: 'Herbal Tea', qty: '50 g' },
      { name: 'Seasonal Surprise', qty: '1 item' },
    ],
    estValue: '₹1,200',
    color: 'border-stone-200',
    badge: '',
  },
  {
    id: 'family',
    name: 'Family Box',
    tagline: 'Ideal for 3–5 people',
    monthlyPrice: 1799,
    fortnightlyPrice: 2159,
    sku: 'FARM-BOX-FAMILY',
    highlight: true,
    items: [
      { name: 'Organic Grains & Millets', qty: '5 kg' },
      { name: 'Organic Pulses', qty: '1 kg' },
      { name: 'Cold-Pressed Oil', qty: '1 L' },
      { name: 'Whole Spices Mix', qty: '200 g' },
      { name: 'Herbal Tea', qty: '100 g' },
      { name: 'Seasonal Surprises', qty: '2 items' },
    ],
    estValue: '₹2,200',
    color: 'border-primary',
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium Box',
    tagline: 'The full farm experience',
    monthlyPrice: 2999,
    fortnightlyPrice: 3599,
    sku: 'FARM-BOX-PREMIUM',
    highlight: false,
    items: [
      { name: 'Organic Grains & Millets', qty: '8 kg' },
      { name: 'Organic Pulses', qty: '2 kg' },
      { name: 'Cold-Pressed Oil', qty: '2 L' },
      { name: 'Whole Spices Mix', qty: '300 g' },
      { name: 'Herbal Tea', qty: '200 g' },
      { name: 'A2 Desi Bilona Ghee', qty: '250 ml' },
      { name: 'Seasonal Surprises', qty: '4 items' },
    ],
    estValue: '₹4,000',
    color: 'border-accent',
    badge: 'Best Value',
  },
]

const TERM_OPTIONS = [
  { months: 1, label: '1 Month', discount: 0 },
  { months: 3, label: '3 Months', discount: 5 },
  { months: 6, label: '6 Months', discount: 10 },
]

const DELIVERY_ZONES = [
  { region: 'Karnataka', cities: 'Bengaluru, Mysuru, Mangaluru, Hubli-Dharwad, Belagavi, Shivamogga' },
  { region: 'Pan India', cities: 'Hyderabad, Chennai, Mumbai, Pune, Delhi, Ahmedabad (+₹99/delivery)' },
]

function makeProduct(plan: typeof PLANS[number], fortnightly: boolean): Product {
  return {
    id: plan.id === 'basic' ? 9999 : plan.id === 'family' ? 9998 : 9997,
    name: `Organic Options ${plan.name}${fortnightly ? ' (Fortnightly)' : ''}`,
    slug: `farm-box-${plan.id}`,
    price: String(fortnightly ? plan.fortnightlyPrice : plan.monthlyPrice),
    regular_price: String(fortnightly ? plan.fortnightlyPrice : plan.monthlyPrice),
    sale_price: '',
    stock_status: 'instock',
    stock_quantity: null,
    images: [],
    categories: [{ id: 0, name: 'Farm Box', slug: 'farm-box' }],
    attributes: [],
    variations: [],
    type: 'simple',
    sku: plan.sku,
    weight: '',
    tags: [],
    average_rating: '0',
    rating_count: 0,
    on_sale: false,
    featured: false,
    description: '',
    short_description: '',
  }
}

export default function FarmBoxPage() {
  const { addItem } = useCart()
  const [frequency, setFrequency] = useState<'monthly' | 'fortnightly'>('monthly')
  const [term, setTerm] = useState(1)
  const [addedId, setAddedId] = useState<string | null>(null)

  const termObj = TERM_OPTIONS.find(t => t.months === term) || TERM_OPTIONS[0]

  function discountedPrice(base: number) {
    return Math.round(base * (1 - termObj.discount / 100))
  }

  function handleAdd(plan: typeof PLANS[number]) {
    const isFortnightly = frequency === 'fortnightly'
    addItem(makeProduct(plan, isFortnightly), 1)
    setAddedId(plan.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  return (
    <Layout
      title="Farm Box Subscription — Organic Options"
      description="Subscribe to Organic Options Farm Box. Choose Basic, Family or Premium — monthly or fortnightly delivery from our Karnataka farm."
    >
      {/* ─── HERO BANNER ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="relative overflow-hidden h-[38vh] rounded-3xl ring-4 ring-primary/25 shadow-xl max-w-7xl mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1920&q=80"
            fill
            className="object-cover object-center"
            alt="Organic farm harvest"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-900/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div>
              <span className="inline-block bg-accent text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Monthly Subscription</span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                The Organic Options<br />Farm Box
              </h1>
              <p className="text-white/70 mt-2 text-base max-w-md">Seasonal organic essentials from our Karnataka farm — delivered to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FREQUENCY & TERM TOGGLES ──────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          {/* Frequency toggle */}
          <div>
            <p className="text-xs font-semibold text-bark/50 uppercase tracking-widest mb-2 text-center">Delivery Frequency</p>
            <div className="flex rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
              {(['monthly', 'fortnightly'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                    frequency === f ? 'bg-primary text-white' : 'text-bark/60 hover:text-bark'
                  }`}
                >
                  {f === 'monthly' ? 'Monthly' : 'Fortnightly'}
                  {f === 'fortnightly' && <span className="ml-1.5 text-[10px] opacity-70">(every 2 weeks)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Term selector */}
          <div>
            <p className="text-xs font-semibold text-bark/50 uppercase tracking-widest mb-2 text-center">Subscription Term</p>
            <div className="flex rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
              {TERM_OPTIONS.map(t => (
                <button
                  key={t.months}
                  onClick={() => setTerm(t.months)}
                  className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
                    term === t.months ? 'bg-primary text-white' : 'text-bark/60 hover:text-bark'
                  }`}
                >
                  {t.label}
                  {t.discount > 0 && (
                    <span className={`ml-1.5 text-[10px] font-bold ${term === t.months ? 'text-primary-200' : 'text-accent'}`}>
                      -{t.discount}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {term > 1 && (
          <p className="text-center text-sm text-primary font-medium mt-4">
            {termObj.discount}% off applied — pay for {term} months upfront and save!
          </p>
        )}
      </section>

      {/* ─── PLAN CARDS ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map(plan => {
            const basePrice = frequency === 'monthly' ? plan.monthlyPrice : plan.fortnightlyPrice
            const finalPrice = discountedPrice(basePrice)
            const saving = basePrice - finalPrice
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border-2 ${plan.color} bg-white p-7 flex flex-col shadow-sm hover:shadow-lg transition-shadow ${
                  plan.highlight ? 'ring-2 ring-primary/30' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold text-white ${plan.id === 'premium' ? 'bg-accent' : 'bg-primary'}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h2 className="font-serif text-2xl font-bold text-bark">{plan.name}</h2>
                  <p className="text-bark/50 text-sm mt-0.5">{plan.tagline}</p>
                </div>

                <div className="mb-5">
                  <div className="flex items-end gap-2">
                    <span className="font-bold text-4xl text-bark">₹{finalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-bark/40 text-sm mb-1">/ {frequency === 'monthly' ? 'month' : '2 weeks'}</span>
                  </div>
                  {saving > 0 && (
                    <p className="text-xs text-primary font-medium mt-1">You save ₹{(saving * term).toLocaleString('en-IN')} over {term} months</p>
                  )}
                  <p className="text-xs text-bark/40 mt-1">Est. value {plan.estValue}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.items.map(item => (
                    <li key={item.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-bark/70">
                        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {item.name}
                      </span>
                      <span className="text-bark/50 font-medium text-xs">{item.qty}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleAdd(plan)}
                  className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-primary text-white hover:bg-primary-700'
                      : 'bg-bark text-white hover:bg-bark/80'
                  }`}
                >
                  {addedId === plan.id ? '✓ Added to Cart' : `Subscribe — ₹${finalPrice.toLocaleString('en-IN')}`}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── CUSTOMISATION & POLICY INFO ──────────────────────── */}
      <section className="bg-primary-50 py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif font-semibold text-bark text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">🔄</span>
              Customisation
            </h3>
            <ul className="space-y-2 text-sm text-bark/60">
              <li>• Swap up to 2 items per box on request</li>
              <li>• Add individual products as add-ons</li>
              <li>• Allergy / dietary preference notes accepted</li>
              <li>• Contact us 5 days before dispatch to customise</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-bark text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">⏸️</span>
              Pause &amp; Cancel
            </h3>
            <ul className="space-y-2 text-sm text-bark/60">
              <li>• Pause anytime with 7 days notice</li>
              <li>• Cancel anytime — no lock-in for monthly</li>
              <li>• Prepaid (3/6 months): unused months refunded at 80%</li>
              <li>• Email us at organicoptionsblr@gmail.com</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-bark text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">🚚</span>
              Delivery Schedule
            </h3>
            <ul className="space-y-2 text-sm text-bark/60">
              <li>• Dispatched on the <strong>1st of every month</strong></li>
              <li>• Fortnightly: 1st &amp; 15th of every month</li>
              <li>• Delivered within 3–7 business days</li>
              <li>• Free delivery on all subscription orders</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── DELIVERY ZONES ───────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="section-title text-center mb-2">Delivery Zones</h2>
        <p className="section-subtitle text-center mb-8">We currently deliver to the following regions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DELIVERY_ZONES.map(z => (
            <div key={z.region} className="card p-6">
              <h3 className="font-serif font-semibold text-bark text-lg mb-2">{z.region}</h3>
              <p className="text-bark/60 text-sm leading-relaxed">{z.cities}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-bark/40 text-sm mt-6">
          Don&apos;t see your city? <a href="mailto:organicoptionsblr@gmail.com" className="text-primary hover:underline">Contact us</a> — we&apos;re expanding.
        </p>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-bark text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-white text-center mb-10">Common Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Can I change my plan later?', a: 'Yes — upgrade or downgrade anytime with 7 days notice before your next dispatch date.' },
              { q: 'What if I\'m not happy with my box?', a: 'Contact us within 48 hours of delivery and we\'ll replace or refund any item you\'re not satisfied with.' },
              { q: 'Is there a minimum subscription commitment?', a: 'No commitment for monthly. For 3-month and 6-month prepaid plans, unused months are refunded at 80%.' },
              { q: 'What pin codes do you deliver to?', a: 'All Bengaluru pin codes, major Karnataka cities, and select pan-India metros. Email us to check your pin code.' },
            ].map(item => (
              <div key={item.q} className="border-b border-white/10 pb-6 last:border-0">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-10">
            More questions? Call <a href="tel:+916364020233" className="text-white/60 hover:text-white">+91 63640 20233</a>
          </p>
        </div>
      </section>
    </Layout>
  )
}
