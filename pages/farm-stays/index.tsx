import Image from 'next/image'
import Layout from '@/components/layout/Layout'

const ACCOMMODATIONS = [
  {
    id: 'cottage',
    name: 'Farm Cottage',
    icon: '🏡',
    capacity: 4,
    weekdayPrice: 3500,
    weekendPrice: 4500,
    amenities: ['Private attached bathroom', 'Air conditioning', 'Farm view balcony', 'Queen bed + bunk bed', 'Organic toiletries'],
    image: 'https://images.unsplash.com/photo-1476362174823-3a23f4aa6d76?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tent',
    name: 'Tent Stay',
    icon: '⛺',
    capacity: 2,
    weekdayPrice: 1800,
    weekendPrice: 2500,
    amenities: ['Premium canvas glamping tent', 'Attached wooden deck', 'Shared eco-bathrooms', 'Sleeping bags & pillows', 'Bonfire pit access'],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dormitory',
    name: 'Dormitory',
    icon: '🛏️',
    capacity: 10,
    weekdayPrice: 800,
    weekendPrice: 800,
    pricingSuffix: '/person',
    amenities: ['Bunk beds (AC dormitory)', 'Shared bathrooms', 'Common lounge area', 'Ideal for groups & schools', 'Lockers available'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  },
]

const INCLUSIONS = [
  { icon: '🍽️', label: 'Organic Breakfast & Dinner' },
  { icon: '🚶', label: 'Guided Farm Walk' },
  { icon: '🌾', label: 'Harvest Activity' },
  { icon: '🧘', label: 'Morning Yoga (optional)' },
  { icon: '🔥', label: 'Evening Bonfire' },
  { icon: '🎁', label: 'Take-Home Produce Pack' },
]

const POLICIES = [
  { icon: '📅', title: 'Check-in / Check-out', details: ['Check-in: 12:00 PM (noon)', 'Check-out: 11:00 AM', 'Early check-in by request (subject to availability)'] },
  { icon: '📋', title: 'Booking Policy', details: ['Advance booking required (min 48 hours)', 'Minimum stay: 1 night', 'Full payment required to confirm', 'Booking confirmation via email/WhatsApp'] },
  { icon: '🔄', title: 'Cancellation & Refund', details: ['7+ days before: Full refund', '3–7 days before: 50% refund', 'Less than 3 days: No refund', 'Force majeure: Full refund or free reschedule'] },
  { icon: '📍', title: 'Location', details: ['Organic Options Farm', 'Near Bengaluru, Karnataka', 'Exact address shared on booking confirmation', 'Approx 60 km from Bengaluru city'] },
]

export default function FarmStaysPage() {
  return (
    <Layout
      title="Farm Stays — Organic Options"
      description="Stay overnight at Organic Options Farm near Bengaluru. Choose from cottages, tent glamping or dormitory. Organic meals, farm activities, and Karnataka countryside."
    >
      {/* ─── HERO BANNER ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="relative overflow-hidden h-[42vh] rounded-3xl ring-4 ring-primary/25 shadow-2xl max-w-7xl mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
            fill
            className="object-cover object-center"
            alt="Karnataka farm landscape for stays"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bark/70 via-bark/30 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Overnight Stay</span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                Sleep on the Farm
              </h1>
              <p className="text-white/70 mt-2 text-base max-w-md">Wake up to birdsong, organic meals, and the fresh air of Karnataka — an experience your city can&apos;t offer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACCOMMODATION TYPES ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Where You&apos;ll Stay</p>
          <h2 className="section-title">Choose Your Accommodation</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {ACCOMMODATIONS.map(acc => (
            <div key={acc.id} className="rounded-3xl overflow-hidden border border-stone-100 bg-white shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-52 bg-stone-100">
                <Image
                  src={acc.image}
                  fill
                  className="object-cover"
                  alt={acc.name}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{acc.icon}</span>
                  <h3 className="font-serif font-bold text-bark text-xl">{acc.name}</h3>
                </div>
                <p className="text-bark/50 text-xs mb-4">Capacity: up to {acc.capacity} guest{acc.capacity > 1 ? 's' : ''}</p>

                <div className="flex gap-4 mb-5">
                  <div className="flex-1 bg-primary-50 rounded-2xl p-3 text-center">
                    <p className="text-[10px] text-primary/60 font-semibold uppercase tracking-wide mb-0.5">Weekday</p>
                    <p className="font-bold text-primary text-lg">₹{acc.weekdayPrice.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-primary/50">/night{acc.pricingSuffix ?? ''}</p>
                  </div>
                  <div className="flex-1 bg-accent/10 rounded-2xl p-3 text-center">
                    <p className="text-[10px] text-accent/60 font-semibold uppercase tracking-wide mb-0.5">Weekend</p>
                    <p className="font-bold text-accent text-lg">₹{acc.weekendPrice.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-accent/50">/night{acc.pricingSuffix ?? ''}</p>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-6 flex-1">
                  {acc.amenities.map(a => (
                    <li key={a} className="flex items-center gap-2 text-xs text-bark/60">
                      <svg className="w-3 h-3 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {a}
                    </li>
                  ))}
                </ul>

                <a
                  href={`mailto:organicoptionsblr@gmail.com?subject=Farm Stay Booking — ${acc.name}`}
                  className="block text-center bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  Book {acc.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="bg-primary-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Every Stay Includes</p>
            <h2 className="section-title">The Full Farm Experience</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {INCLUSIONS.map(inc => (
              <div key={inc.label} className="bg-white rounded-2xl p-5 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">{inc.icon}</span>
                <p className="text-sm font-medium text-bark">{inc.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AVAILABILITY ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-8">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Availability</p>
          <h2 className="section-title">When Can You Visit?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="card p-6">
            <p className="text-3xl mb-3">📅</p>
            <h3 className="font-semibold text-bark mb-1">Open Days</h3>
            <p className="text-bark/60 text-sm">Weekends year-round<br />Weekdays by special arrangement</p>
          </div>
          <div className="card p-6">
            <p className="text-3xl mb-3">⛔</p>
            <h3 className="font-semibold text-bark mb-1">Blackout Dates</h3>
            <p className="text-bark/60 text-sm">Peak harvest season<br />(October – November)<br />Major public holidays</p>
          </div>
          <div className="card p-6">
            <p className="text-3xl mb-3">👥</p>
            <h3 className="font-semibold text-bark mb-1">Group Bookings</h3>
            <p className="text-bark/60 text-sm">Corporate retreats &amp; school trips welcome<br />Special rates for 10+ people</p>
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
          Email us with your preferred dates, number of guests, and accommodation type. We&apos;ll confirm availability within 24 hours.
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
