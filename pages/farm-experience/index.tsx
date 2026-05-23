import Image from 'next/image'
import Layout from '@/components/layout/Layout'

const COURSES = [
  {
    id: 'farm-tour',
    icon: '🚜',
    name: 'Farm Tour',
    duration: '2–3 hours',
    price: 299,
    groupMin: 2,
    groupMax: 30,
    level: 'All ages',
    desc: 'Walk through our certified organic fields, meet our head farmer, and learn how chemical-free agriculture works from soil to harvest.',
    includes: ['Guided walk through all farm sections', 'Q&A session with head farmer', 'Complimentary organic tea & coffee', 'Farm brochure & take-home recipe card'],
    highlight: false,
    badge: '',
  },
  {
    id: 'workshop',
    icon: '🌱',
    name: 'Organic Farming Workshop',
    duration: 'Half day (4 hrs)',
    price: 799,
    groupMin: 4,
    groupMax: 20,
    level: 'Teens & Adults',
    desc: 'Get your hands in the soil! Practical sessions covering seed sowing, composting, natural pest control, and water harvesting techniques.',
    includes: ['Hands-on seed sowing activity', 'Compost pit demonstration & participation', 'Natural pest control techniques', 'Organic light lunch included', 'Certificate of participation'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'cooking',
    icon: '🍳',
    name: 'Farm-to-Table Cooking',
    duration: '3–4 hours',
    price: 1299,
    groupMin: 4,
    groupMax: 15,
    level: 'Adults',
    desc: 'Harvest fresh produce from the field and then cook a traditional Karnataka meal using ingredients you picked yourself — a true sensory experience.',
    includes: ['Harvest session in the field', 'Traditional Karnataka cooking class', 'Full farm-to-table meal', 'Recipes to take home', 'Farm produce sampler bag'],
    highlight: false,
    badge: 'Premium',
  },
  {
    id: 'organic-living',
    icon: '📚',
    name: 'Organic Living Session',
    duration: '2 hours',
    price: 499,
    groupMin: 2,
    groupMax: 25,
    level: 'All ages',
    desc: 'A practical presentation on how to bring organic living into your daily routine — reading food labels, home gardening tips, and choosing the right products.',
    includes: ['Interactive presentation', 'Home garden starter kit', 'How-to guide booklet', 'Sample organic products to take home', 'Q&A with our nutritionist'],
    highlight: false,
    badge: '',
  },
  {
    id: 'full-day',
    icon: '🌟',
    name: 'Full Day Farm Immersion',
    duration: 'Full day (8 hrs)',
    price: 1999,
    groupMin: 2,
    groupMax: 15,
    level: 'All ages',
    desc: 'The complete Organic Options experience — farm tour, workshop, cooking class, and a guided sunset walk. Perfect for families and teams.',
    includes: ['Farm tour + Organic farming workshop', 'Farm-to-table cooking class', 'Full organic breakfast, lunch & evening snack', 'Sunset guided nature walk', 'Large produce take-home pack', 'Group photo with farm team'],
    highlight: false,
    badge: 'Best Experience',
  },
]

const WHAT_TO_EXPECT = [
  { icon: '🌿', text: 'Fully certified organic farm — no chemicals anywhere on the property' },
  { icon: '👨‍🌾', text: 'Led by experienced farmers with 15+ years of organic practice' },
  { icon: '👶', text: 'Family-friendly — children learn while playing and exploring' },
  { icon: '🚌', text: 'Easy 60-km drive from Bengaluru city centre' },
]

export default function FarmCoursesPage() {
  return (
    <Layout
      title="Farm Courses — Organic Options"
      description="Join hands-on farm courses at Organic Options near Bengaluru — farm tours, organic farming workshops, farm-to-table cooking, and full-day immersions."
    >
      {/* ─── HERO BANNER ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="relative overflow-hidden h-[42vh] rounded-3xl ring-4 ring-primary/25 shadow-2xl max-w-7xl mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=80"
            fill
            className="object-cover object-center"
            alt="Organic farm course Karnataka"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-900/30 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div>
              <span className="inline-block bg-accent text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Hands-On Learning</span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                Farm Courses &amp;<br />Experiences
              </h1>
              <p className="text-white/70 mt-2 text-base max-w-md">Learn organic farming directly from our farmers — from soil to table, at our Karnataka farm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INFO STRIP ───────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '📍', label: 'Location', value: 'Near Bengaluru, Karnataka' },
            { icon: '📅', label: 'Availability', value: 'Weekends & Weekdays' },
            { icon: '👥', label: 'Group Size', value: '2–30 people' },
            { icon: '🗣️', label: 'Languages', value: 'English, Kannada, Hindi' },
          ].map(item => (
            <div key={item.label} className="text-center bg-primary-50 rounded-2xl p-4">
              <p className="text-xl mb-1">{item.icon}</p>
              <p className="text-[10px] font-semibold text-primary/60 uppercase tracking-widest">{item.label}</p>
              <p className="text-sm font-medium text-bark mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COURSE CARDS ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Choose Your Course</p>
          <h2 className="section-title">What We Offer</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <div
              key={course.id}
              className={`relative rounded-3xl border-2 bg-white p-6 flex flex-col shadow-sm hover:shadow-lg transition-shadow ${
                course.highlight ? 'border-primary ring-2 ring-primary/20' : 'border-stone-100'
              }`}
            >
              {course.badge && (
                <div className="absolute -top-3.5 left-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-primary">
                    {course.badge}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{course.icon}</span>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-bark text-lg leading-tight">{course.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-[10px] bg-primary-50 text-primary px-2 py-0.5 rounded-full font-medium">{course.duration}</span>
                    <span className="text-[10px] bg-stone-100 text-bark/60 px-2 py-0.5 rounded-full font-medium">{course.level}</span>
                    <span className="text-[10px] bg-stone-100 text-bark/60 px-2 py-0.5 rounded-full font-medium">{course.groupMin}–{course.groupMax} people</span>
                  </div>
                </div>
              </div>

              <p className="text-bark/60 text-sm leading-relaxed mb-4">{course.desc}</p>

              <ul className="space-y-1.5 mb-5 flex-1">
                {course.includes.map(inc => (
                  <li key={inc} className="flex items-start gap-2 text-xs text-bark/60">
                    <svg className="w-3 h-3 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {inc}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-bold text-2xl text-bark">₹{course.price.toLocaleString('en-IN')}</span>
                  <span className="text-bark/40 text-xs ml-1">/person</span>
                </div>
              </div>

              <a
                href={`mailto:organicoptionsblr@gmail.com?subject=Farm Course Booking — ${course.name}`}
                className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  course.highlight
                    ? 'bg-primary text-white hover:bg-primary-700'
                    : 'bg-stone-100 text-bark hover:bg-primary hover:text-white'
                }`}
              >
                Book This Course
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT TO EXPECT ───────────────────────────────────── */}
      <section className="bg-primary-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-8">What to Expect</h2>
          <ul className="space-y-4">
            {WHAT_TO_EXPECT.map(item => (
              <li key={item.text} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-bark/70 text-sm leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── BOOKING CTA ──────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-3xl font-semibold text-bark mb-4">Ready to Book?</h2>
        <p className="text-bark/60 mb-8 text-sm leading-relaxed">
          Email us with your chosen course, preferred date, and group size. We&apos;ll confirm within 24 hours with the meeting point and pre-course details.
        </p>
        <a
          href="mailto:organicoptionsblr@gmail.com?subject=Farm Course Booking"
          className="btn-primary text-base px-8 py-3.5"
        >
          Book via Email
        </a>
        <p className="text-bark/40 text-sm mt-6">
          Call us: <a href="tel:+916364020233" className="text-primary">+91 63640 20233</a> ·{' '}
          <a href="tel:+918050459000" className="text-primary">+91 80504 59000</a>
        </p>
      </section>
    </Layout>
  )
}
