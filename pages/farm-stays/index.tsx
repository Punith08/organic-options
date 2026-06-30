import Image from 'next/image'
import Layout from '@/components/layout/Layout'

const WHY_CHOOSE = [
  { icon: '🌿', text: '8 acres of a real working organic farm — not a decorated resort.' },
  { icon: '🥗', text: 'Over 80% of your meals are harvested fresh from our farm on the same day.' },
  { icon: '🚗', text: 'Just 2 hours from Bangalore with minimal traffic and a pollution-free environment.' },
  { icon: '👨‍👩‍👧', text: 'Perfect for families, children, senior citizens, and anyone looking to relax and reconnect with nature.' },
  { icon: '🌾', text: 'Learn about organic farming through hands-on experiences.' },
]

const DAY_SCHEDULE = [
  {
    time: '12:00 PM',
    label: 'Arrival & Welcome',
    desc: 'Welcome drink with fresh farm juice and check-in to your room.',
    icon: '🥤',
  },
  {
    time: '1:00 PM',
    label: 'Farm-Fresh Lunch',
    desc: 'Delicious farm-fresh lunch prepared exclusively for you using produce harvested that morning.',
    icon: '🍽️',
  },
  {
    time: '5:00 PM',
    label: 'Farm Walk & Harvest',
    desc: 'Guided farm walk through our 8 acres followed by hands-on vegetable harvesting for your dinner.',
    icon: '🚶',
  },
  {
    time: '7:00 PM',
    label: 'Bonfire Evening',
    desc: 'Bonfire, fun activities, and a relaxing evening under the stars with your loved ones.',
    icon: '🔥',
  },
]

const MORNING_ACTIVITIES = [
  { icon: '🫓', text: 'Traditional Ragi Dosa prepared from our farm-grown ragi' },
  { icon: '🛒', text: 'Bullock cart ride around the farm' },
  { icon: '🌅', text: 'Fresh farm breakfast before departure' },
]

const ROOM_FEATURES = [
  'Attached bathroom and toilet',
  'Private balcony overlooking the organic farm',
  'Simple, clean, and peaceful accommodation',
  'No TV · No Wi-Fi · Just nature, fresh air, and quality time',
]

const POLICIES = [
  {
    icon: '📅',
    title: 'Check-in / Check-out',
    details: ['Check-in: 12:00 PM (noon)', 'Check-out: 11:00 AM next morning', 'Early check-in by request (subject to availability)'],
  },
  {
    icon: '📋',
    title: 'Booking Policy',
    details: ['Advance booking required (min 48 hours)', 'Minimum stay: 1 night', 'Full payment required to confirm', 'Booking confirmation via email/WhatsApp'],
  },
  {
    icon: '🔄',
    title: 'Cancellation & Refund',
    details: ['7+ days before: Full refund', '3–7 days before: 50% refund', 'Less than 3 days: No refund', 'Force majeure: Full refund or free reschedule'],
  },
  {
    icon: '📍',
    title: 'Location',
    details: ['Organic Options Farm', 'Near Bengaluru, Karnataka', 'Approx 2 hours drive from Bangalore city', 'Exact address shared on booking confirmation'],
  },
]

export default function FarmStaysPage() {
  return (
    <Layout
      title="Farm Stay — Organic Options"
      description="Stay overnight at Organic Options Farm near Bengaluru. Walk and sleep where your food grows — 8 acres of organic farm, fresh meals, bonfire evenings, and bullock cart rides."
    >
      {/* ─── HERO BANNER ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="relative overflow-hidden h-[50vh] rounded-3xl ring-4 ring-primary/25 shadow-2xl max-w-7xl mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
            fill
            className="object-cover object-center"
            alt="Organic Options Farm Stay Karnataka"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bark/75 via-bark/35 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Overnight Farm Stay</span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                Walk and Sleep Where<br />Your Food Grows
              </h1>
              <p className="text-white/70 mt-3 text-base max-w-lg">
                Escape the city&apos;s hustle and reconnect with nature at Organic Options Farm Stay. Spread across 8 acres of organically cultivated fruits and vegetables.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <span className="bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">🌿 8 Acres Organic Farm</span>
                <span className="bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">🚗 2 hrs from Bangalore</span>
                <span className="bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">🌾 Zero Pollution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Why Us</p>
          <h2 className="section-title">Why Choose Organic Options Farm Stay?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_CHOOSE.map((item, i) => (
            <div key={i} className="bg-primary-50 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
              <p className="text-sm text-bark/70 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DAY SCHEDULE ─────────────────────────────────────── */}
      <section className="bg-stone-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Your Itinerary</p>
            <h2 className="section-title">Experience a Day on the Farm</h2>
          </div>

          {/* Day 1 timeline */}
          <div className="relative pl-8 border-l-2 border-primary/20 space-y-8 mb-10">
            {DAY_SCHEDULE.map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[2.15rem] top-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-sm shadow">
                  {item.icon}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 ml-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded-full">{item.time}</span>
                    <h3 className="font-semibold text-bark text-sm">{item.label}</h3>
                  </div>
                  <p className="text-bark/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Next morning */}
          <div className="bg-white border border-primary/20 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-bark text-lg mb-4 flex items-center gap-2">
              <span>🌅</span> Next Morning
            </h3>
            <ul className="space-y-3">
              {MORNING_ACTIVITIES.map((act, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-bark/70">
                  <span className="text-xl">{act.icon}</span>
                  {act.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── ROOMS & STAY ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Where You&apos;ll Sleep</p>
          <h2 className="section-title">Rooms &amp; Stay</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1476362174823-3a23f4aa6d76?auto=format&fit=crop&w=800&q=80"
              fill
              className="object-cover"
              alt="Farm stay room with balcony"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <ul className="space-y-4 mb-8">
              {ROOM_FEATURES.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-bark/70 text-sm">
                  <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
            <div className="bg-primary-50 rounded-2xl p-5 border border-primary/10">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">Our Philosophy</p>
              <p className="text-bark/70 text-sm leading-relaxed">
                We intentionally keep our rooms simple and screen-free. No TV, no Wi-Fi — because the real experience is the farm outside your window: birdsong, fresh air, and the quiet of rural life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POLICIES GRID ────────────────────────────────────── */}
      <section className="bg-stone-50 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center mb-10">Stay Policies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {POLICIES.map(pol => (
              <div key={pol.title} className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-serif font-semibold text-bark text-lg mb-3 flex items-center gap-2">
                  <span>{pol.icon}</span> {pol.title}
                </h3>
                <ul className="space-y-1.5">
                  {pol.details.map(d => (
                    <li key={d} className="text-sm text-bark/60 flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING CTA ──────────────────────────────────────── */}
      <section className="bg-bark text-white py-16 px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Ready to Book Your Farm Stay?</h2>
        <p className="text-white/60 text-base max-w-xl mx-auto mb-8">
          Email us with your preferred dates and number of guests. We&apos;ll confirm availability within 24 hours with all the details you need.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="mailto:organicoptionsblr@gmail.com?subject=Farm Stay Booking"
            className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-primary-700 transition-colors"
          >
            Book via Email
          </a>
          <a
            href="tel:+916364020233"
            className="border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-white/10 transition-colors"
          >
            Call +91 63640 20233
          </a>
        </div>
        <p className="text-white/30 text-sm mt-8">Full payment required to confirm booking · Free cancellation 7+ days before arrival</p>
      </section>
    </Layout>
  )
}
