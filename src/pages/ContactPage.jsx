import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Globe, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@globalvisa.com',
    desc: 'We respond within 2 hours',
    href: 'mailto:support@globalvisa.com',
    gradient: 'from-royal-500 to-royal-600',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (800) 555-VISA',
    desc: 'Mon-Fri, 9AM - 6PM EST',
    href: 'tel:+18005558472',
    gradient: 'from-teal-500 to-teal-600',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: 'Chat with us',
    desc: 'Available 24/7',
    href: 'https://wa.me/18005558472',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: '123 Immigration Tower',
    desc: 'Toronto, Canada M5H 2N2',
    href: 'https://maps.google.com',
    gradient: 'from-gold-500 to-gold-600',
  },
]

const offices = [
  { city: 'Toronto', country: 'Canada', timezone: 'EST', flag: '\u{1F1E8}\u{1F1E6}' },
  { city: 'London', country: 'UK', timezone: 'GMT', flag: '\u{1F1EC}\u{1F1E7}' },
  { city: 'Sydney', country: 'Australia', timezone: 'AEST', flag: '\u{1F1E6}\u{1F1FA}' },
  { city: 'Dubai', country: 'UAE', timezone: 'GST', flag: '\u{1F1E6}\u{1F1EA}' },
]

function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    country: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Message sent successfully! We\'ll get back to you within 2 hours.')
      setFormData({ name: '', email: '', phone: '', service: '', country: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-navy-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="badge badge-blue mx-auto mb-4">
              <Globe size={12} /> Get in Touch
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Let&apos;s Start Your <span className="gradient-text">Journey</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Have questions about immigration? Our expert consultants are here to help. 
              Reach out and get a response within 2 hours.
            </p>
          </motion.div>

          {/* Contact Methods Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20">
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.title}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 text-center group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon size={26} className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{method.title}</h3>
                <p className="text-royal-400 font-medium text-sm mb-1">{method.value}</p>
                <p className="text-slate-500 text-xs">{method.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <AnimatedSection>
              <div className="glass-premium rounded-3xl p-8 lg:p-10">
                <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                <p className="text-slate-400 mb-8">Fill out the form below and we&apos;ll get back to you shortly.</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="label">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Smith"
                        className="input-glass"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@email.com"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="input-glass"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="label">Service Needed</label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="input-glass"
                      >
                        <option value="">Select service...</option>
                        <option value="work-permit">Work Permit</option>
                        <option value="study-visa">Study Visa</option>
                        <option value="immigration">Immigration / PR</option>
                        <option value="job-assistance">Job Assistance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="label">Preferred Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="input-glass"
                    >
                      <option value="">Select country...</option>
                      <option value="canada">Canada</option>
                      <option value="australia">Australia</option>
                      <option value="germany">Germany</option>
                      <option value="uk">United Kingdom</option>
                      <option value="usa">USA</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="label">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Tell us about your immigration goals..."
                      className="input-glass resize-none"
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                  >
                    <Send size={18} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
                
                <p className="text-xs text-slate-500 text-center mt-4">
                  By submitting, you agree to our Privacy Policy. We respect your data.
                </p>
              </div>
            </AnimatedSection>

            {/* Info Section */}
            <div className="space-y-8">
              <AnimatedSection delay={0.1}>
                <div className="glass-card rounded-2xl p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Why Contact Us?</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Free Initial Consultation', desc: 'Get expert advice on your immigration options at no cost.' },
                      { title: '2-Hour Response Time', desc: 'Our team responds to all inquiries within 2 business hours.' },
                      { title: 'ICCRC Certified Experts', desc: 'Speak directly with licensed immigration consultants.' },
                      { title: '98% Success Rate', desc: 'Industry-leading approval rate across all visa categories.' },
                    ].map((item, i) => (
                      <div key={item.title} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ArrowRight size={12} className="text-teal-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{item.title}</div>
                          <div className="text-slate-500 text-sm">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="glass-card rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-royal-400" />
                    <h3 className="text-xl font-bold text-white">Our Global Offices</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {offices.map((office) => (
                      <div key={office.city} className="p-3 rounded-xl bg-white/3 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{office.flag}</span>
                          <span className="text-white font-medium text-sm">{office.city}</span>
                        </div>
                        <div className="text-slate-500 text-xs">{office.country}</div>
                        <div className="text-royal-400 text-xs mt-1">{office.timezone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="glass-card rounded-2xl p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Business Hours</h3>
                  <div className="space-y-3">
                    {[
                      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                      { day: 'Sunday', hours: 'Closed' },
                    ].map((item) => (
                      <div key={item.day} className="flex justify-between text-sm">
                        <span className="text-slate-400">{item.day}</span>
                        <span className="text-white font-medium">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500">
                      All times are in Eastern Standard Time (EST). 
                      WhatsApp support is available 24/7.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Find Us</h2>
            <p className="text-slate-400">Visit our head office in Toronto, Canada</p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.1}>
            <div className="glass-card rounded-2xl overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4360456073814!2d-79.38320492346097!3d43.65322917110163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d68bf33a9b%3A0x15edd8c4de1c7581!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sus!4v1704067200000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
