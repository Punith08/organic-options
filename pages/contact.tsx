import Layout from '@/components/layout/Layout'

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name') as string
    const email = fd.get('email') as string
    const phone = fd.get('phone') as string
    const message = fd.get('message') as string
    window.location.href = `mailto:organicoptionsblr@gmail.com?subject=Message from ${name}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`)}`
  }

  return (
    <Layout title="Contact Us" description="Get in touch with Organic Options Farms.">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-semibold text-bark mb-2">Contact Us</h1>
        <p className="text-bark/50 mb-10">We&apos;d love to hear from you. Reach out any time.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-bark mb-3">Contact Information</h2>
              <div className="space-y-3 text-sm text-bark/70">
                <p>📍 No. 53, 2nd Main, 2nd Stage, Nandini Layout, Bengaluru</p>
                <p>📞 <a href="tel:+916364020233" className="text-primary hover:underline">+91 63640 20233</a></p>
                <p>📞 <a href="tel:+918050459000" className="text-primary hover:underline">+91 80504 59000</a></p>
                <p>✉️ <a href="mailto:organicoptionsblr@gmail.com" className="text-primary hover:underline">organicoptionsblr@gmail.com</a></p>
                <p>🏅 FSSAI: 21224000001072</p>
                <p>🕐 Mon–Sat: 9 AM – 6 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Name *</label>
              <input name="name" required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Email *</label>
              <input type="email" name="email" required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Phone</label>
              <input type="tel" name="phone" className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-bark/70 mb-1">Message *</label>
              <textarea name="message" required rows={5} className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
