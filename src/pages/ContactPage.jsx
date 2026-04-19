import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Globe, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import SEO from '../components/SEO'
import { submitConsultation } from '../lib/supabaseClient'
import { COUNTRY_CODES, detectCountryCode } from '../data/countryCodes'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'info@siddhivinayakoverseas.com',
    desc: 'We respond within 2 hours',
    href: 'mailto:info@siddhivinayakoverseas.com',
    gradient: 'from-royal-500 to-royal-600',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 99250 64666',
    desc: 'Mon-Sat, 9AM - 7PM IST',
    href: 'tel:+919925064666',
    gradient: 'from-teal-500 to-teal-600',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: 'Chat with us',
    desc: 'Available 24/7',
    href: 'https://wa.me/919925064666',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'Pragati IT Park',
    desc: 'Yogi Chowk, Surat, Gujarat',
    href: 'https://www.google.com/maps/search/?api=1&query=Pragati+IT+Park+Yogi+Chowk+Surat+Gujarat',
    gradient: 'from-gold-500 to-gold-600',
  },
]

const offices = [
  { city: 'Surat', country: 'India', timezone: 'IST', flag: '\u{1F1EE}\u{1F1F3}' },
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
    phoneCode: '+91',
    phone: '',
    whatsappCode: '+91',
    whatsapp: '',
    service: '',
    country: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [phoneDetected, setPhoneDetected] = useState(null)
  const [waDetected, setWaDetected] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await submitConsultation({
        name: formData.name,
        email: formData.email,
        phone: `${formData.phoneCode} ${formData.phone}`,
        whatsapp: `${formData.whatsappCode} ${formData.whatsapp}`,
        service_type: formData.service,
        country: formData.country,
        message: formData.message
      })
      if (error) throw error
      toast.success('Message sent successfully! We\'ll get back to you within 2 hours.')
      setFormData({
        name: '', email: '',
        phoneCode: '+91', phone: '',
        whatsappCode: '+91', whatsapp: '',
        service: '', country: '', message: ''
      })
    } catch (error) {
      toast.error(error.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-navy-950 min-h-screen">
      <SEO 
        title="Contact Us" 
        description="Get in touch with our expert immigration consultants. We offer 24/7 support for all your visa and immigration queries."
        keywords="contact immigration consultant, visa help, immigration support, Surat visa consultancy"
      />
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

                  {/* Phone Number with country code */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label className="label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} className="text-royal-400" /> Phone Number
                      </label>
                      {phoneDetected && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', color: '#4ade80',
                          background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                          borderRadius: '9999px', padding: '2px 8px'
                        }}>✓ Detected {phoneDetected.flag} {phoneDetected.name}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        style={{ width: '120px', flexShrink: 0 }}
                        className="input-glass text-white bg-navy-900"
                        value={formData.phoneCode}
                        onChange={e => setFormData(prev => ({ ...prev, phoneCode: e.target.value }))}
                      >
                        {COUNTRY_CODES.map((c, i) => (
                          <option key={i} value={c.code} className="text-white bg-navy-900">
                            {c.flag} {c.code} {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        style={{ flex: 1, minWidth: 0 }}
                        className="input-glass"
                        placeholder={`e.g. ${formData.phoneCode} 9876543210`}
                        value={formData.phone}
                        onChange={e => {
                          const val = e.target.value
                          const det = detectCountryCode(val)
                          if (det) {
                            setFormData(prev => ({ ...prev, phoneCode: det.code, phone: det.number }))
                            setPhoneDetected(det)
                            setTimeout(() => setPhoneDetected(null), 3000)
                          } else {
                            setFormData(prev => ({ ...prev, phone: val }))
                            setPhoneDetected(null)
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* WhatsApp Number with country code */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label className="label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageCircle size={13} className="text-green-400" /> WhatsApp Number
                      </label>
                      {waDetected && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', color: '#4ade80',
                          background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                          borderRadius: '9999px', padding: '2px 8px'
                        }}>✓ Detected {waDetected.flag} {waDetected.name}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        style={{ width: '120px', flexShrink: 0 }}
                        className="input-glass text-white bg-navy-900"
                        value={formData.whatsappCode}
                        onChange={e => setFormData(prev => ({ ...prev, whatsappCode: e.target.value }))}
                      >
                        {COUNTRY_CODES.map((c, i) => (
                          <option key={i} value={c.code} className="text-white bg-navy-900">
                            {c.flag} {c.code} {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        style={{ flex: 1, minWidth: 0 }}
                        className="input-glass"
                        placeholder={`e.g. ${formData.whatsappCode} 9876543210`}
                        value={formData.whatsapp}
                        onChange={e => {
                          const val = e.target.value
                          const det = detectCountryCode(val)
                          if (det) {
                            setFormData(prev => ({ ...prev, whatsappCode: det.code, whatsapp: det.number }))
                            setWaDetected(det)
                            setTimeout(() => setWaDetected(null), 3000)
                          } else {
                            setFormData(prev => ({ ...prev, whatsapp: val }))
                            setWaDetected(null)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="label">Service Needed</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="input-glass text-white bg-navy-900"
                    >
                      <option value="" className="text-slate-400 bg-navy-900">Select service...</option>
                      <option value="work-permit" className="text-white bg-navy-900">Work Permit</option>
                      <option value="study-visa" className="text-white bg-navy-900">Study Visa</option>
                      <option value="other" className="text-white bg-navy-900">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="country" className="label">Preferred Country</label>
                    <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="input-glass text-white bg-navy-900"
                  >
                    <option value="" className="text-slate-400 bg-navy-900">Select country...</option>
                    <option value="canada" className="text-white bg-navy-900">Canada</option>
                    <option value="australia" className="text-white bg-navy-900">Australia</option>
                    <option value="germany" className="text-white bg-navy-900">Germany</option>
                    <option value="uk" className="text-white bg-navy-900">United Kingdom</option>
                    <option value="usa" className="text-white bg-navy-900">USA</option>
                    <option value="other" className="text-white bg-navy-900">Other</option>
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
                  <div className="grid grid-cols-1 gap-4">
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
                      All times are in Indian Standard Time (IST). 
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
            <p className="text-slate-400">Visit our head office in Surat, Gujarat </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.1}>
            <div className="glass-card rounded-2xl overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0123456789!2d72.889501!3d21.226834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4340798e3b%3A0xc3f8e58319a92444!2sPragati%20IT%20Park!5e0!3m2!1sen!2sin!4v1713500000000!5m2!1sen!2sin"
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
