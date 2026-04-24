import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
  GraduationCap, Globe, ArrowRight, Star, CheckCircle,
  Users, Award, Clock, Shield, TrendingUp, Zap, ChevronRight, Plane,
  MessageCircle, FileCheck, Sparkles, Phone, Stamp, BookOpen, PlaneTakeoff,
  LifeBuoy, UserCheck, Building2, MapPin, Quote
} from 'lucide-react'

import Globe3D from '../components/Globe3D'
import SEO from '../components/SEO'
import { submitConsultation } from '../lib/supabaseClient'
import { customerReviews, getReviewInitials } from '../data/reviews'

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PHONE        = '+91 99250 64666'
const PHONE_RAW    = '919925064666'
const PHONE_UK     = '+44 7471 489599'
const WA_LINK      = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent('Hi Siddhivinayak Overseas, I would like a free consultation.')}`

const COUNTRY_CODES = [
  { code: '+91', flag: 'IN', name: 'India' },
  { code: '+44', flag: 'UK', name: 'United Kingdom' },
  { code: '+49', flag: 'DE', name: 'Germany' },
  { code: '+33', flag: 'FR', name: 'France' },
  { code: '+1',  flag: 'US', name: 'USA' },
  { code: '+1',  flag: 'CA', name: 'Canada' },
  { code: '+61', flag: 'AU', name: 'Australia' },
  { code: '+971',flag: 'AE', name: 'UAE' },
]

// ─── DATA ────────────────────────────────────────────────────────────────────
const stats = [
  { number: '100+', label: 'Students Placed',    icon: Users },
  { number: '98%',  label: 'Visa Success Rate',  icon: TrendingUp },
  { number: '3',    label: 'Premier Destinations',icon: Globe },
  { number: '5+',   label: 'Years of Expertise', icon: Award },
]

const endToEndServices = [
  { icon: UserCheck,  title: 'Expert Counselling',        desc: 'Personalised guidance from certified counsellors who understand your dreams.' },
  { icon: BookOpen,   title: 'University Selection',      desc: 'Shortlists built around your profile, budget and post-study goals.' },
  { icon: FileCheck,  title: 'Application Assistance',    desc: 'SOP, LOR, transcripts and every document perfected, end-to-end.' },
  { icon: Stamp,      title: 'Visa Filing & Interview Prep',desc: 'Airtight visa drafts plus mock interviews to clear them confidently.' },
  { icon: PlaneTakeoff, title: 'Pre-Departure Support',   desc: 'Forex, travel, accommodation and cultural briefings before you fly.' },
  { icon: LifeBuoy,   title: 'Post-Arrival Support',      desc: 'On-ground help with SIM, bank account, housing and settling in.' },
]

const countries = [
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'UK',
    tag: '2-Year PSW Visa',
    benefits: [
      'Top-ranked Russell Group universities',
      '2-year Post-Study Work Visa',
      'Global career opportunities',
    ],
    path: '/countries/uk',
    accent: 'from-sky-400/30 to-navy-900/10',
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    code: 'DE',
    tag: 'Low / No Tuition',
    benefits: [
      'Public universities with low/no tuition',
      '18-month post-study job search visa',
      'Europe\u2019s strongest engineering hub',
    ],
    path: '/countries/germany',
    accent: 'from-gold-400/25 to-sky-400/10',
  },
  {
    name: 'France',
    flag: '🇫🇷',
    code: 'FR',
    tag: '12-Month APS',
    benefits: [
      'World-class business & luxury schools',
      '12-month post-study residence permit',
      'Scholarships for Indian students',
    ],
    path: '/countries/france',
    accent: 'from-sky-300/25 to-gold-300/10',
  },
]

const partnerUniversities = [
  { name: 'University of Leicester',        country: 'UK',     desc: 'Russell Group research university with 900+ programmes.', programs: 'Business, Engineering, Law' },
  { name: 'Coventry University',            country: 'UK',     desc: 'Top 15 modern UK university with global campuses.',       programs: 'MBA, Cybersecurity, Design' },
  { name: 'Middlesex University',           country: 'UK',     desc: 'London-based, industry-linked, practice-first.',          programs: 'Computing, Media, Business' },
  { name: 'Schiller International University',country: 'Germany', desc: 'Study in Heidelberg, Paris, Madrid and Tampa on one degree.', programs: 'International Business, IR' },
  { name: 'EU Business School',             country: 'Germany',desc: 'Triple-accredited business school in Munich.',            programs: 'BBA, MBA, Masters in Finance' },
  { name: 'Neoma Business School',          country: 'France', desc: 'Top-10 French business school, AACSB & EQUIS accredited.',programs: 'MiM, MSc Finance, MBA' },
]

const visaBenefits = [
  { icon: Clock,     label: 'Processing Time',  value: '~30 Days' },
  { icon: FileCheck, label: 'COS Issue',        value: 'From 1 Week' },
  { icon: Stamp,     label: 'IHS Fee',          value: 'Client Borne' },
]

const processSteps = [
  { step: '01', icon: FileCheck, title: 'Free Assessment',      desc: 'A 30-minute discovery call to understand your background and goals.' },
  { step: '02', icon: Users,     title: 'Strategy Planning',    desc: 'A tailored roadmap covering country, course, finances and timeline.' },
  { step: '03', icon: BookOpen,  title: 'Application & Docs',   desc: 'SOP, LOR and university applications — reviewed and submitted by experts.' },
  { step: '04', icon: PlaneTakeoff,title: 'Visa & Departure',   desc: 'Visa filing, interview prep and pre-departure briefing till wheels-up.' },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function detectCountryCode(value, codes) {
  let normalized = value.trim()
  if (normalized.startsWith('00') && normalized.length > 3) normalized = '+' + normalized.slice(2)
  if (!normalized.startsWith('+')) return null
  const sorted = [...codes].sort((a, b) => b.code.length - a.code.length)
  for (const c of sorted) {
    if (normalized.startsWith(c.code)) {
      const rest = normalized.slice(c.code.length).replace(/^[\s-]+/, '')
      return { ...c, number: rest }
    }
  }
  return null
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FloatingCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '', email: '',
    phoneCode: '+91', phone: '',
    whatsappCode: '+91', whatsapp: '',
    service: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [phoneDetected, setPhoneDetected] = useState(null)
  const [waDetected, setWaDetected] = useState(null)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1, 0.96])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { error } = await submitConsultation({
        name: formData.name,
        email: formData.email,
        phone:    `${formData.phoneCode} ${formData.phone}`,
        whatsapp: `${formData.whatsappCode} ${formData.whatsapp}`,
        service_type: formData.service,
        message: formData.message,
        country: 'Not Specified',
      })
      if (error) throw error
      setSubmitted(true)
      setFormData({ name: '', email: '', phoneCode: '+91', phone: '', whatsappCode: '+91', whatsapp: '', service: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      console.error('Error submitting consultation:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <SEO
        title="Study Abroad Consultants for UK, Germany & France"
        description="Siddhivinayak Overseas — premium overseas education consultancy for UK, Germany and France. University admissions, UK Visa & COS assistance, 98% visa success rate. Book a free consultation."
        keywords="study abroad consultants India, study in UK from India, Germany student visa consultant, France study abroad consultancy, UK COS assistance, overseas education consultants Surat"
      />

      {/* ========== HERO ========== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 dot-pattern opacity-40" />

        {/* Animated Plane crossing hero */}
        <motion.div
          className="absolute left-0 top-1/3 text-navy-700/40 z-[1] plane-path"
          initial={false}
          aria-hidden="true"
        >
          <Plane size={42} className="rotate-12 text-gold-500" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-10 left-10 w-[460px] h-[460px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(135, 206, 235, 0.45) 0%, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)' }}
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                  >
                    <div className="flex -space-x-2">
                      {['PS', 'AR', 'RK'].map((initials) => (
                        <div
                          key={initials}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-navy-700 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-navy-800">
                      <span className="font-semibold">100+</span> students placed abroad
                    </span>
                    <Star size={14} className="text-gold-500 fill-gold-500" />
                  </motion.div>

                  <h1 className="font-display text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-navy-900 leading-[1.05] mb-6 tracking-tight text-balance">
                    Study Abroad With{' '}
                    <span className="gradient-text-gold">Confidence</span>
                  </h1>

                  <p className="font-display text-xl lg:text-2xl text-navy-700/80 font-medium mb-4">
                    Your Dream. Our Guidance. Your Future.
                  </p>

                  <p className="text-base lg:text-lg text-navy-700/75 leading-relaxed mb-8 max-w-lg">
                    Premium overseas education consultancy for <span className="font-semibold text-navy-900">UK, Germany & France</span>.
                    From university admissions and UK Visa &amp; COS assistance to pre-departure briefings &mdash;
                    we guide you end-to-end with a{' '}
                    <span className="text-navy-900 font-semibold">98% visa success rate</span>.
                  </p>

                  <div className="flex flex-wrap gap-3 sm:gap-4 mb-10">
                    <Link to="/apply">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary flex items-center gap-2 group"
                      >
                        <span>Start Your Application</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                    <Link to="/contact">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-gold flex items-center gap-2"
                      >
                        <Sparkles size={16} />
                        Free Consultation
                      </motion.button>
                    </Link>
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-whatsapp"
                      >
                        <MessageCircle size={16} />
                        WhatsApp Now
                      </motion.button>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-sm text-navy-700/75">
                    {[
                      { icon: Shield, text: 'UKVI Compliant' },
                      { icon: Zap, text: 'Fast COS Turnaround' },
                      { icon: Clock, text: '24/7 Student Support' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <item.icon size={16} className="text-gold-600" />
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right - 3D Globe + floating cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative block mt-10 md:mt-0"
              >
                <div className="w-full aspect-square max-w-[18rem] sm:max-w-md md:max-w-lg mx-auto relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-300/40 via-transparent to-gold-300/20 blur-3xl" aria-hidden="true" />
                  <Globe3D autoRotateSpeed={0.0028} enableZoom />
                </div>

                <FloatingCard delay={0} className="absolute top-6 -left-4 sm:-left-8 z-20">
                  <div className="glass-card rounded-xl p-4 shadow-premium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-navy-900">UK CAS Issued</div>
                        <div className="text-xs text-navy-700/70">Leicester \u00b7 Just now</div>
                      </div>
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={1.5} className="absolute bottom-16 -right-2 sm:-right-4 z-20">
                  <div className="glass-card rounded-xl p-4 shadow-premium">
                    <div className="text-xs text-navy-700/70 mb-1">Visa Processing</div>
                    <div className="text-2xl font-bold text-navy-900 font-display">~30 Days</div>
                    <div className="text-xs text-gold-600 flex items-center gap-1 mt-1 font-semibold">
                      <Zap size={12} /> Priority Available
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={2.5} className="absolute top-1/2 -right-10 sm:-right-12 z-20">
                  <div className="glass-gold rounded-xl p-3 shadow-premium">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                        <TrendingUp size={16} className="text-navy-900" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-navy-900 font-display leading-none">98%</div>
                        <div className="text-[11px] text-navy-700/75">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sky-50 to-transparent" />
      </section>

      {/* ========== STATS ========== */}
      <section className="relative py-16 -mt-10 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="glass-premium rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400/25 to-gold-300/25 flex items-center justify-center">
                        <stat.icon size={22} className="text-navy-800" />
                      </div>
                    </div>
                    <div className="stat-number text-3xl lg:text-4xl mb-1 font-display">{stat.number}</div>
                    <div className="text-navy-700/80 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== COUNTRIES ========== */}
      <section className="section-pad relative" aria-labelledby="countries-heading">
        <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-sky mx-auto mb-4">
              <Globe size={12} /> Our Destinations
            </div>
            <h2 id="countries-heading" className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-4 tracking-tight text-balance">
              Three Premier <span className="gradient-text-gold">Destinations</span>
            </h2>
            <p className="text-navy-700/80 max-w-2xl mx-auto text-lg">
              We specialise in three of the world&apos;s most rewarding study destinations &mdash;
              curated for Indian students who want world-class education with long post-study work rights.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {countries.map((country, i) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link to={country.path}>
                  <div className={`country-card p-8 h-full flex flex-col bg-gradient-to-br ${country.accent}`}>
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-6xl drop-shadow-sm" aria-hidden="true">{country.flag}</span>
                      <div className="badge badge-gold text-[10px]">{country.tag}</div>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-navy-900 mb-4 group-hover:text-navy-700 transition-colors">
                      Study in {country.name}
                    </h3>
                    <ul className="space-y-3 mb-6 flex-1">
                      {country.benefits.map((b) => (
                        <li key={b} className="flex gap-3 text-navy-700 text-sm">
                          <CheckCircle size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-navy-800 text-sm font-semibold group-hover:gap-3 transition-all">
                      Explore {country.code} <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARTNER UNIVERSITIES ========== */}
      <section className="section-pad relative overflow-hidden" aria-labelledby="universities-heading">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-gold mx-auto mb-4">
              <Building2 size={12} /> Partner Universities
            </div>
            <h2 id="universities-heading" className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-4 tracking-tight text-balance">
              World-Class <span className="gradient-text-gold">University Partners</span>
            </h2>
            <p className="text-navy-700/80 max-w-2xl mx-auto text-lg">
              Direct partnerships mean faster admissions, fee waivers and scholarship access.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerUniversities.map((uni, i) => (
              <motion.article
                key={uni.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-6 border hover:border-gold-400/60 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-navy-700 flex items-center justify-center text-white font-display font-bold shadow-card">
                    {uni.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-navy-900 leading-tight">{uni.name}</h3>
                    <span className="text-xs text-gold-600 font-semibold uppercase tracking-wider">{uni.country}</span>
                  </div>
                </div>
                <p className="text-sm text-navy-700/80 leading-relaxed mb-4">{uni.desc}</p>
                <div className="text-xs text-navy-700 font-medium flex items-start gap-2 pt-4 border-t border-navy-900/10">
                  <BookOpen size={14} className="text-sky-600 mt-0.5 flex-shrink-0" />
                  <span>{uni.programs}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== UK VISA & COS ASSISTANCE ========== */}
      <section className="section-pad relative overflow-hidden" aria-labelledby="uk-visa-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 -z-10" />
        <div className="absolute inset-0 dot-pattern opacity-10 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/35 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-5">
                <Stamp size={12} /> UK Visa &amp; COS Assistance
              </div>
              <h2 id="uk-visa-heading" className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight text-balance">
                From India to the UK &mdash; <span className="text-gold-400">we handle every stamp.</span>
              </h2>
              <p className="text-sky-100/85 leading-relaxed mb-8 text-lg">
                Whether you are applying from India or transitioning within the UK, our UKVI-compliant
                team manages Certificate of Sponsorship, visa drafting, IHS guidance and priority processing.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {visaBenefits.map((v) => (
                  <div key={v.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <v.icon size={20} className="text-gold-400 mb-2" />
                    <div className="text-xs text-sky-100/70 font-medium mb-1">{v.label}</div>
                    <div className="text-lg font-bold text-white font-display">{v.value}</div>
                  </div>
                ))}
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'India to UK visa transition with documentation',
                  'Within UK visa processing (switch & extension)',
                  'Interview preparation & biometrics booking',
                  'IHS fee guidance (payable by applicant)',
                ].map((point) => (
                  <li key={point} className="flex gap-3 text-sky-50">
                    <CheckCircle size={18} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link to="/services/study-visa">
                  <button className="btn-gold">Learn About UK Visa</button>
                </Link>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                  <button className="btn-whatsapp">
                    <MessageCircle size={16} /> Ask an Expert
                  </button>
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/30 via-transparent to-sky-400/20 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {[
                    { icon: FileCheck, label: 'Documents', desc: 'Verified' },
                    { icon: Stamp, label: 'Visa Stamp', desc: 'Approved' },
                    { icon: Plane, label: 'Travel', desc: 'Booked' },
                    { icon: CheckCircle, label: 'CAS', desc: 'Issued' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.12 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6, rotate: -1 }}
                      className={`aspect-square rounded-3xl p-6 flex flex-col justify-between backdrop-blur-sm border border-white/15 ${i % 2 === 0 ? 'bg-white/8' : 'bg-gold-500/10'}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold">
                        <item.icon size={22} className="text-navy-900" />
                      </div>
                      <div>
                        <div className="text-white font-display font-bold text-lg">{item.label}</div>
                        <div className="text-sky-200/70 text-sm">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== END-TO-END SUPPORT ========== */}
      <section className="section-pad relative overflow-hidden" aria-labelledby="support-heading">
        <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-sky mx-auto mb-4">
              <LifeBuoy size={12} /> End-to-End Support
            </div>
            <h2 id="support-heading" className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-4 tracking-tight text-balance">
              From First Call to <span className="gradient-text-gold">Graduation Day</span>
            </h2>
            <p className="text-navy-700/80 max-w-2xl mx-auto text-lg">
              We don&apos;t disappear after the visa is stamped. Our counsellors stay with you through every milestone.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {endToEndServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl p-7 group transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold mb-5"
                >
                  <s.icon size={24} className="text-navy-900" />
                </motion.div>
                <h3 className="font-display text-xl font-bold text-navy-900 mb-2">{s.title}</h3>
                <p className="text-navy-700/80 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROCESS ========== */}
      <section className="section-pad relative" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-gold mx-auto mb-4">
              <Zap size={12} /> How It Works
            </div>
            <h2 id="process-heading" className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-4 tracking-tight">
              A Simple 4-Step <span className="gradient-text-gold">Journey</span>
            </h2>
            <p className="text-navy-700/80 max-w-2xl mx-auto text-lg">
              Our streamlined process keeps you informed at every stage.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="glass-card rounded-2xl p-6 h-full relative overflow-hidden transition-all duration-300 group-hover:border-gold-400/60 group-hover:shadow-glow-gold">
                  <div className="font-display text-5xl font-bold mb-4 text-gold-400/35 group-hover:text-gold-500/70 transition-colors">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400/30 to-gold-300/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                    <step.icon size={22} className="text-navy-800" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-navy-700/75 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight size={24} className="text-gold-500/45 group-hover:text-gold-500 transition-colors" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="section-pad relative overflow-hidden" aria-labelledby="testimonials-heading">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-sky mx-auto mb-4">
              <Star size={12} className="fill-current" /> Student Stories
            </div>
            <h2 id="testimonials-heading" className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-4 tracking-tight">
              Loved by <span className="gradient-text-gold">Indian Students</span>
            </h2>
            <p className="text-navy-700/80 max-w-2xl mx-auto text-lg">
              Real stories from students now thriving in the UK, Germany and France.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {customerReviews.slice(0, 6).map((t, i) => (
              <motion.figure
                key={`${t.name}-${t.country}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 lg:p-8 relative"
              >
                <Quote size={28} className="text-gold-400/50 absolute top-6 right-6" aria-hidden="true" />
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={16} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <blockquote className="text-navy-800 leading-relaxed mb-6 text-sm">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-navy-900/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-navy-700 flex items-center justify-center text-white font-bold text-sm">
                    {getReviewInitials(t.name)}
                  </div>
                  <div>
                    <div className="text-navy-900 font-display font-semibold">{t.name}</div>
                    <div className="text-navy-700/70 text-xs">{t.country}</div>
                  </div>
                </figcaption>
                <div className="absolute top-6 left-6">
                  <div className="badge badge-gold text-[10px]">{t.visa}</div>
                </div>
              </motion.figure>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/reviews">
              <button className="btn-outline inline-flex items-center gap-2">
                More Reviews <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== WHY + FORM ========== */}
      <section className="section-pad relative" aria-labelledby="contact-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <AnimatedSection>
              <div className="badge badge-gold mb-5">Why Choose Us</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-5 tracking-tight leading-tight text-balance">
                Trusted by{' '}
                <span className="gradient-text-gold">100+ Indian Families</span>
              </h2>
              <p className="text-navy-700/80 leading-relaxed mb-8 text-lg">
                Personal, premium and ethical study-abroad counselling &mdash; the way it should be.
                No call-centre vibes, no cookie-cutter advice.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Shield,     title: 'UKVI & Institution-Compliant', desc: 'Every document we file meets UKVI and university guidelines.' },
                  { icon: Zap,        title: 'Fast COS & Offer Turnaround',  desc: 'Many offers within 7\u201310 working days; COS from 1 week.' },
                  { icon: UserCheck,  title: 'Dedicated Counsellor',          desc: 'One expert handles your case from SOP to settling abroad.' },
                  { icon: TrendingUp, title: '98% Visa Approval Rate',        desc: 'Industry-leading success across UK, Germany and France.' },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="trust-card"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-glow-gold">
                        <feature.icon size={22} className="text-navy-900" />
                      </div>
                      <div>
                        <div className="font-display font-semibold text-navy-900 mb-1">{feature.title}</div>
                        <div className="text-navy-700/80 text-sm">{feature.desc}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 glass-gold rounded-2xl p-6 flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-xs text-gold-700 font-semibold uppercase tracking-wider mb-1">Talk to an Expert</div>
                  <a href={`tel:${PHONE_RAW}`} className="font-display text-2xl font-bold text-navy-900 hover:text-gold-700 transition-colors">
                    {PHONE}
                  </a>
                  <div className="text-xs text-navy-700/80 mt-1">UK line: {PHONE_UK}</div>
                </div>
                <a href={`tel:${PHONE_RAW}`} className="btn-primary ml-auto">
                  <Phone size={16} className="mr-2" /> Call Now
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="glass-premium rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold-400/30 to-sky-400/20 rounded-full -mr-20 -mt-20 blur-3xl" />

                <div className="relative z-10">
                  <h3 id="contact-heading" className="font-display text-2xl font-bold text-navy-900 mb-2">Free Expert Consultation</h3>
                  <p className="text-navy-700/80 mb-8">Tell us about your goals &mdash; we&apos;ll get back within 2 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="label" htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        className="input-glass"
                        placeholder="e.g. Priya Sharma"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="email">Email</label>
                      <input
                        id="email"
                        className="input-glass"
                        type="email"
                        placeholder="priya@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="label inline-flex items-center gap-1.5 m-0" htmlFor="phone">
                          <Phone size={13} className="text-sky-600" /> Phone Number
                        </label>
                        {phoneDetected && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-100/60 border border-teal-400/40 rounded-full px-2 py-0.5 font-medium">
                            Detected {phoneDetected.name}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <select
                          className="input-glass"
                          style={{ width: '118px', flexShrink: 0 }}
                          value={formData.phoneCode}
                          onChange={e => setFormData({ ...formData, phoneCode: e.target.value })}
                        >
                          {COUNTRY_CODES.map((c, i) => (
                            <option key={i} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <input
                          id="phone"
                          className="input-glass"
                          style={{ flex: 1, minWidth: 0 }}
                          type="tel"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={e => {
                            const val = e.target.value
                            const det = detectCountryCode(val, COUNTRY_CODES)
                            if (det) {
                              setFormData({ ...formData, phoneCode: det.code, phone: det.number })
                              setPhoneDetected(det)
                              setTimeout(() => setPhoneDetected(null), 3000)
                            } else {
                              setFormData({ ...formData, phone: val })
                              setPhoneDetected(null)
                            }
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="label inline-flex items-center gap-1.5 m-0" htmlFor="wa">
                          <MessageCircle size={13} className="text-teal-600" /> WhatsApp Number
                        </label>
                        {waDetected && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-100/60 border border-teal-400/40 rounded-full px-2 py-0.5 font-medium">
                            Detected {waDetected.name}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <select
                          className="input-glass"
                          style={{ width: '118px', flexShrink: 0 }}
                          value={formData.whatsappCode}
                          onChange={e => setFormData({ ...formData, whatsappCode: e.target.value })}
                        >
                          {COUNTRY_CODES.map((c, i) => (
                            <option key={i} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <input
                          id="wa"
                          className="input-glass"
                          style={{ flex: 1, minWidth: 0 }}
                          type="tel"
                          placeholder="9876543210"
                          value={formData.whatsapp}
                          onChange={e => {
                            const val = e.target.value
                            const det = detectCountryCode(val, COUNTRY_CODES)
                            if (det) {
                              setFormData({ ...formData, whatsappCode: det.code, whatsapp: det.number })
                              setWaDetected(det)
                              setTimeout(() => setWaDetected(null), 3000)
                            } else {
                              setFormData({ ...formData, whatsapp: val })
                              setWaDetected(null)
                            }
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label" htmlFor="service">Service Needed</label>
                      <select
                        id="service"
                        className="input-glass"
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        required
                      >
                        <option value="">Select a service...</option>
                        <option value="study-uk">Study in UK</option>
                        <option value="study-germany">Study in Germany</option>
                        <option value="study-france">Study in France</option>
                        <option value="uk-visa-cos">UK Visa &amp; COS Assistance</option>
                        <option value="admission">University Admission Guidance</option>
                      </select>
                    </div>

                    <div>
                      <label className="label" htmlFor="msg">Message (Optional)</label>
                      <textarea
                        id="msg"
                        className="input-glass"
                        rows="3"
                        placeholder="Tell us about your academic background and goals..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting || submitted}
                      className="btn-primary w-full"
                    >
                      {submitting ? 'Sending...' : submitted ? 'Request Sent!' : 'Book Free Consultation'}
                    </motion.button>
                  </form>

                  <p className="text-xs text-navy-700/65 text-center mt-4">
                    No commitment required &mdash; response within 2 hours
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700" />
        <div className="absolute inset-0 dot-pattern opacity-15" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 lg:p-16 shadow-premium"
            >
              <MapPin size={36} className="mx-auto text-gold-400 mb-4" />
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to begin your study-abroad journey?
              </h2>
              <p className="text-sky-100/80 mb-8 text-lg max-w-xl mx-auto">
                Book a free 30-minute consultation with a certified counsellor today.
                No commitment &mdash; just clear, expert guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/apply">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-gold">
                    Start Your Application <ArrowRight size={18} className="ml-2" />
                  </motion.button>
                </Link>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-whatsapp">
                    <MessageCircle size={18} /> WhatsApp: {PHONE}
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
