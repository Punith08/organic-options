import Link from 'next/link'
import Layout from '@/components/layout/Layout'

export default function AboutPage() {
  return (
    <Layout title="About Us" description="Learn about Organic Options Farms — our story, mission, and commitment to chemical-free organic farming.">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-bark text-white py-20 px-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold">Our Story</h1>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="section-title mb-4">From Seed to Your Table</h2>
        <div className="prose prose-sm text-bark/70 leading-relaxed space-y-4">
          <p>Organic Options Farms was founded by Subramanya with a simple yet powerful mission — to provide Indian families with food that is truly pure, truly organic, and truly trustworthy.</p>
          <p>Based in Nandini Layout, Bengaluru, we run a certified organic farm where every crop is grown without synthetic pesticides, chemical fertilizers, or GMOs. We believe that the health of our soil is the foundation of the health of our food — and ultimately, the health of our community.</p>
          <p>We started small — a family farm with a handful of dedicated farmers who believed in doing things the right way. Today, we grow a wide range of organic grains, pulses, cold-pressed oils, spices, and herbal products, all lab-tested and FSSAI certified.</p>
          <p>Our Farm Box program and direct delivery model allow us to cut out the middleman, ensuring you receive the freshest organic produce at fair prices, while our farmers are paid fairly for their labor and care.</p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🌿', title: 'Purity First', desc: 'We never compromise on purity — no chemicals, no shortcuts, no exceptions.' },
              { icon: '🤝', title: 'Farmer Respect', desc: 'Fair wages, safe working conditions, and a voice in how we grow.' },
              { icon: '🌍', title: 'Earth Stewardship', desc: 'We farm in harmony with nature — composting, water conservation, and biodiversity.' },
            ].map(v => (
              <div key={v.title} className="card p-6 text-center">
                <p className="text-4xl mb-3">{v.icon}</p>
                <h3 className="font-serif font-semibold text-bark mb-2">{v.title}</h3>
                <p className="text-bark/60 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="section-title text-center mb-10">Our Certifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🏅', title: 'FSSAI Certified', detail: '21224000001072' },
            { icon: '📋', title: 'GST Registered', detail: 'Karnataka, India' },
            { icon: '✅', title: 'Organic Certified', detail: 'Chemical-Free Farming' },
          ].map(c => (
            <div key={c.title} className="card p-6 text-center">
              <p className="text-3xl mb-2">{c.icon}</p>
              <h3 className="font-semibold text-bark mb-1">{c.title}</h3>
              <p className="text-bark/50 text-xs">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-bark text-white py-14 px-4 text-center">
        <h2 className="font-serif text-2xl font-semibold mb-6">Get in Touch</h2>
        <div className="flex flex-wrap justify-center gap-8 text-white/70 text-sm mb-8">
          <div><p className="text-white font-medium mb-1">Phone</p><p>+91 63640 20233</p><p>+91 80504 59000</p></div>
          <div><p className="text-white font-medium mb-1">Email</p><p>organicoptionsblr@gmail.com</p></div>
          <div><p className="text-white font-medium mb-1">Address</p><p>No. 53, 2nd Main, 2nd Stage,<br />Nandini Layout, Bengaluru</p></div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/shop" className="btn-primary">Shop Now</Link>
          <Link href="/farm-experience" className="btn-outline border-white text-white hover:bg-white hover:text-bark">Visit Our Farm</Link>
        </div>
      </section>
    </Layout>
  )
}
