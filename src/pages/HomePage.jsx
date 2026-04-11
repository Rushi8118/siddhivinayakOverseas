import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
  Briefcase, GraduationCap, Globe, ArrowRight, Star, CheckCircle,
  Users, Award, Clock, Shield, TrendingUp, Zap, ChevronRight, Play,
  MessageCircle, Building, FileCheck, Sparkles
} from 'lucide-react'
import Globe3D from '../components/Globe3D'

// Trust & Social Proof Data
const stats = [
  { number: '50,000+', label: 'Clients Worldwide', icon: Users },
  { number: '98%', label: 'Success Rate', icon: TrendingUp },
  { number: '45+', label: 'Countries', icon: Globe },
  { number: '15+', label: 'Years Experience', icon: Award },
]

const services = [
  {
    icon: Briefcase,
    title: 'Work Permit',
    desc: 'Navigate complex work permit applications with expert guidance. From documentation to approval, we handle every detail.',
    gradient: 'from-blue-500 to-cyan-400',
    bgGradient: 'from-blue-500/10 to-cyan-400/5',
    badge: 'Most Popular',
    link: '/services/work-permit',
    stats: '8,000+ Permits',
  },
  {
    icon: GraduationCap,
    title: 'Study Visa',
    desc: 'Turn your academic dreams into reality. Access 500+ top universities worldwide with our comprehensive student visa service.',
    gradient: 'from-teal-500 to-emerald-400',
    bgGradient: 'from-teal-500/10 to-emerald-400/5',
    badge: 'Fast Track',
    link: '/services/study-visa',
    stats: '15,000+ Students',
  },
  {
    icon: Building,
    title: 'Immigration',
    desc: 'Start your new chapter with permanent residency support. Expert guidance for PR applications and citizenship pathways.',
    gradient: 'from-royal-500 to-indigo-400',
    bgGradient: 'from-royal-500/10 to-indigo-400/5',
    badge: 'Premium',
    link: '/services/job-assistance',
    stats: '25,000+ PRs',
  },
]

const countries = [
  { name: 'Canada', flag: '🇨🇦', visas: '12 Visa Types', popular: 'Express Entry', path: '/countries/canada', color: 'from-red-500/20 to-red-600/10' },
  { name: 'Australia', flag: '🇦🇺', visas: '10 Visa Types', popular: 'Skilled Migration', path: '/countries/australia', color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'UK', flag: '🇬🇧', visas: '9 Visa Types', popular: 'Skilled Worker', path: '/countries/uk', color: 'from-indigo-500/20 to-indigo-600/10' },
  { name: 'Germany', flag: '🇩🇪', visas: '8 Visa Types', popular: 'EU Blue Card', path: '/countries/germany', color: 'from-yellow-500/20 to-yellow-600/10' },
  { name: 'France', flag: '🇫🇷', visas: '8 Visa Types', popular: 'Work Visa', path: '/countries/france', color: 'from-blue-500/20 to-red-500/10' },
  { name: 'Singapore', flag: '🇸🇬', visas: '6 Visa Types', popular: 'EP/S Pass', path: '/countries/singapore', color: 'from-red-500/20 to-white/10' },
  { name: 'New Zealand', flag: '🇳🇿', visas: '9 Visa Types', popular: 'Skilled Migrant', path: '/countries/new-zealand', color: 'from-blue-600/20 to-red-500/10' },
  { name: 'Ireland', flag: '🇮🇪', visas: '7 Visa Types', popular: 'Critical Skills', path: '/countries/ireland', color: 'from-green-500/20 to-orange-500/10' },
]

// Globe markers for supported countries/regions (approximate lat/lon)
const countryMarkers = [
  // Europe (West & North)
  { name: 'Germany', lat: 51.1657, lon: 10.4515, color: '#fbbf24', flag: '🇩🇪' },
  { name: 'UK', lat: 55.3781, lon: -3.4360, color: '#60a5fa', flag: '🇬🇧' },
  { name: 'France', lat: 46.2276, lon: 2.2137, color: '#818cf8', flag: '🇫🇷' },
  { name: 'Ireland', lat: 53.4129, lon: -8.2439, color: '#2dd4bf', flag: '🇮🇪' },
  { name: 'Netherlands', lat: 52.1326, lon: 5.2913, color: '#60a5fa', flag: '🇳🇱' },
  { name: 'Switzerland', lat: 46.8182, lon: 8.2275, color: '#fbbf24', flag: '🇨🇭' },
  { name: 'Denmark', lat: 56.2639, lon: 9.5018, color: '#2dd4bf', flag: '🇩🇰' },
  { name: 'Sweden', lat: 60.1282, lon: 18.6435, color: '#60a5fa', flag: '🇸🇪' },
  { name: 'Norway', lat: 60.4720, lon: 8.4689, color: '#60a5fa', flag: '🇳🇴' },
  { name: 'Finland', lat: 61.9241, lon: 25.7482, color: '#60a5fa', flag: '🇫🇮' },
  // Europe (South & East)
  { name: 'Spain', lat: 40.4637, lon: -3.7492, color: '#fbbf24', flag: '🇪🇸' },
  { name: 'Portugal', lat: 39.3999, lon: -8.2245, color: '#fbbf24', flag: '🇵🇹' },
  { name: 'Malta', lat: 35.9375, lon: 14.3754, color: '#fbbf24', flag: '🇲🇹' },
  { name: 'Poland', lat: 51.9194, lon: 19.1451, color: '#fbbf24', flag: '🇵🇱' },
  { name: 'Austria', lat: 47.5162, lon: 14.5501, color: '#fbbf24', flag: '🇦🇹' },
  { name: 'Croatia', lat: 45.1000, lon: 15.2000, color: '#fbbf24', flag: '🇭🇷' },
  { name: 'Greece', lat: 39.0742, lon: 21.8243, color: '#fbbf24', flag: '🇬🇷' },
  { name: 'Romania', lat: 45.9432, lon: 24.9668, color: '#fbbf24', flag: '🇷🇴' },
  { name: 'Slovakia', lat: 48.6690, lon: 19.6990, color: '#fbbf24', flag: '🇸🇰' },
  { name: 'Hungary', lat: 47.1625, lon: 19.5033, color: '#fbbf24', flag: '🇭🇺' },
  // Europe (East)
  { name: 'Albania', lat: 41.1533, lon: 20.1683, color: '#fbbf24', flag: '🇦🇱' },
  { name: 'Armenia', lat: 40.0691, lon: 45.0382, color: '#fbbf24', flag: '🇦🇲' },
  { name: 'Belarus', lat: 53.7098, lon: 27.9534, color: '#fbbf24', flag: '🇧🇾' },
  { name: 'Moldova', lat: 47.4116, lon: 28.3699, color: '#fbbf24', flag: '🇲🇩' },
  { name: 'Azerbaijan', lat: 40.1431, lon: 47.5769, color: '#fbbf24', flag: '🇦🇿' },
  { name: 'Russia', lat: 61.5240, lon: 105.3188, color: '#fbbf24', flag: '🇷🇺' },
  // Americas & Pacific
  { name: 'Canada', lat: 56.1304, lon: -106.3468, color: '#60a5fa', flag: '🇨🇦' },
  { name: 'Australia', lat: -25.2744, lon: 133.7751, color: '#2dd4bf', flag: '🇦🇺' },
  { name: 'New Zealand', lat: -40.9006, lon: 174.8860, color: '#2dd4bf', flag: '🇳🇿' },
  // Asia, Middle East & Africa
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: '#60a5fa', flag: '🇸🇬' },
  { name: 'Malaysia', lat: 4.2105, lon: 101.9758, color: '#60a5fa', flag: '🇲🇾' },
  { name: 'Maldives', lat: 3.2028, lon: 73.2207, color: '#60a5fa', flag: '🇲🇻' },
  { name: 'Kazakhstan', lat: 48.0196, lon: 66.9237, color: '#60a5fa', flag: '🇰🇿' },
  { name: 'Saudi Arabia', lat: 23.8859, lon: 45.0792, color: '#60a5fa', flag: '🇸🇦' },
  { name: 'Qatar', lat: 25.2854, lon: 51.5310, color: '#60a5fa', flag: '🇶🇦' },
  { name: 'Israel', lat: 31.0461, lon: 34.8516, color: '#60a5fa', flag: '🇮🇱' },
  { name: 'Gulf Region', lat: 25.0, lon: 51.0, color: '#60a5fa', flag: '🚩' },
  { name: 'Africa Region', lat: 1.5, lon: 17.0, color: '#60a5fa', flag: '🌍' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    country: 'India to Canada',
    rating: 5,
    text: 'SiddhivinayakOverseas made my dream of working in Canada a reality. The team was incredibly knowledgeable and supportive throughout the entire process. Highly recommended!',
    visa: 'Express Entry PR',
    avatar: 'PS',
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'Data Scientist',
    country: 'UAE to Germany',
    rating: 5,
    text: 'I got my EU Blue Card in just 3 months! The consultants knew exactly what documents were needed and guided me flawlessly. Exceptional service!',
    visa: 'EU Blue Card',
    avatar: 'AR',
  },
  {
    name: 'Chen Wei',
    role: 'Graduate Student',
    country: 'China to Australia',
    rating: 5,
    text: 'From student visa to permanent residency, SiddhivinayakOverseas was with me every step. They genuinely care about their clients\' success.',
    visa: 'Skilled Migration',
    avatar: 'CW',
  },
]

const trustBadges = [
  { icon: Shield, label: 'ICCRC Certified', desc: 'Licensed Consultants' },
  { icon: FileCheck, label: 'ISO 9001:2015', desc: 'Quality Certified' },
  { icon: Award, label: 'BBB A+ Rated', desc: 'Accredited Business' },
  { icon: Clock, label: '24/7 Support', desc: 'Always Available' },
]

const processSteps = [
  { step: '01', title: 'Free Assessment', desc: 'Complete our eligibility assessment to understand your immigration options.' },
  { step: '02', title: 'Strategy Planning', desc: 'Our experts create a personalized immigration strategy tailored to your goals.' },
  { step: '03', title: 'Document Preparation', desc: 'We guide you through collecting and preparing all required documentation.' },
  { step: '04', title: 'Application & Approval', desc: 'We submit your application and track it until successful approval.' },
]

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

// Animated Section Component
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

// Floating Card Component
function FloatingCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Country Flag Component
function CountryFlag({ country }) {
  return <span className="text-4xl">{country}</span>
}

export default function HomePage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="bg-navy-950">
      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)' }}
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {/* Trust Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
                  >
                    <div className="flex -space-x-2">
                      {['PS', 'AR', 'CW'].map((initials, i) => (
                        <div
                          key={initials}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-navy-950"
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-slate-300">
                      <span className="text-white font-semibold">50,000+</span> clients trust us worldwide
                    </span>
                    <Star size={14} className="text-gold-400 fill-gold-400" />
                  </motion.div>

                  {/* Headline */}
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                    Global{' '}
                    <span className="gradient-text">Work Permits</span>{' '}
                    & Vacancies Available
                  </h1>
                  
                  <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                    Secure your future with globally recognized visas and work opportunities.
                    Premium guidance, fast processing, and{' '}
                    <span className="text-white font-medium">98% success rate</span>.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 mb-10">
                    <Link to="/apply">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary flex items-center gap-2 group"
                      >
                        <span>Apply Now</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                    <Link to="/contact">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-outline flex items-center gap-2"
                      >
                        <Play size={16} className="fill-current" />
                        Free Consultation
                      </motion.button>
                    </Link>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                    {[
                      { icon: Shield, text: 'ICCRC Certified' },
                      { icon: Zap, text: 'Fast Processing' },
                      { icon: Clock, text: '24/7 Support' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <item.icon size={16} className="text-teal-400" />
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right - 3D Globe with Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative block mt-10 md:mt-0"
              >
                <div className="w-full aspect-square max-w-[18rem] sm:max-w-md md:max-w-lg mx-auto relative">
                  {/* Globe Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-royal-500/20 via-teal-500/10 to-transparent blur-3xl" />
                  <Globe3D markers={countryMarkers} autoRotateSpeed={0.005} enableZoom showTooltip />
                </div>

                {/* Countries Legend */}
                <div className="absolute left-0 bottom-6 z-20">
                  <div className="glass-card rounded-xl p-3">
                    <div className="text-xs text-slate-400">Hover markers to see country names</div>
                  </div>
                </div>

                {/* Floating Cards */}
                <FloatingCard delay={0} className="absolute top-8 -left-8 z-20">
                  <div className="glass-card rounded-xl p-4 shadow-premium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Visa Approved!</div>
                        <div className="text-xs text-slate-400">Canada PR - Just now</div>
                      </div>
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={1.5} className="absolute bottom-20 -right-4 z-20">
                  <div className="glass-card rounded-xl p-4 shadow-premium">
                    <div className="text-xs text-slate-400 mb-1">Processing Time</div>
                    <div className="text-2xl font-bold text-white">8-12 weeks</div>
                    <div className="text-xs text-teal-400 flex items-center gap-1 mt-1">
                      <Zap size={12} /> Express Available
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={2.5} className="absolute top-1/2 -right-12 z-20">
                  <div className="glass-card rounded-xl p-3 shadow-premium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                        <TrendingUp size={16} className="text-navy-950" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">98%</div>
                        <div className="text-xs text-slate-400">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="relative py-16 -mt-16 z-20">
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-500/20 to-teal-500/20 flex items-center justify-center">
                        <stat.icon size={24} className="text-royal-400" />
                      </div>
                    </div>
                    <div className="stat-number text-3xl lg:text-4xl mb-1">{stat.number}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== TRUST BADGES ========== */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-slate-400"
              >
                <badge.icon size={20} className="text-royal-400" />
                <div>
                  <div className="text-white font-medium text-sm">{badge.label}</div>
                  <div className="text-xs">{badge.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="section-pad relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-blue mx-auto mb-4">
              <Sparkles size={12} /> Our Services
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Immigration Solutions That <span className="gradient-text">Work</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Comprehensive immigration services tailored to your unique needs, 
              backed by 15+ years of expertise.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <Link to={service.link}>
                  <div className={`glass-card rounded-2xl p-8 h-full relative overflow-hidden transition-all duration-500 group-hover:border-royal-500/30`}>
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      {/* Badge */}
                      <div className="badge badge-gold mb-6 text-xs">{service.badge}</div>
                      
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon size={26} className="text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.desc}</p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-xs text-teal-400 font-medium">{service.stats}</span>
                        <div className="flex items-center gap-2 text-royal-400 text-sm font-semibold group-hover:gap-3 transition-all">
                          Learn More <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COUNTRIES ========== */}
      <section className="section-pad relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-teal mx-auto mb-4">
              <Globe size={12} /> Destinations
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Your Dream <span className="gradient-text">Destination</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Explore immigration opportunities across the world&apos;s most sought-after destinations.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {countries.map((country, i) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link to={country.path}>
                  <div className={`glass-card rounded-2xl p-6 text-center group cursor-pointer h-full transition-all duration-300 hover:border-royal-500/30`}>
                    <div className="mb-4">
                      <CountryFlag country={country.flag} />
                    </div>
                    <div className="text-white font-semibold mb-1">{country.name}</div>
                    <div className="text-xs text-slate-500 mb-3">{country.visas}</div>
                    <div className="badge badge-teal text-xs mx-auto">{country.popular}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROCESS SECTION ========== */}
      <section className="section-pad relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-gold mx-auto mb-4">
              <Zap size={12} /> How It Works
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Simple 4-Step <span className="gradient-text">Process</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Our streamlined process ensures a smooth journey from assessment to approval.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="text-5xl font-bold text-royal-500/20 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight size={24} className="text-royal-500/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US + FORM ========== */}
      <section className="section-pad relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <div className="badge badge-gold mb-6">Why Choose Us</div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                The Trusted Choice for{' '}
                <span className="gradient-text">50,000+ Clients</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-10 text-lg">
                With over 15 years of experience, our team of certified immigration consultants 
                has helped thousands achieve their international dreams.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'ICCRC Certified Consultants', desc: 'All our consultants are fully certified and regulated by ICCRC' },
                  { icon: Zap, title: 'Fast Processing Times', desc: 'We streamline applications for the quickest turnarounds possible' },
                  { icon: Users, title: 'Dedicated Case Manager', desc: 'Personal attention for every application from start to finish' },
                  { icon: TrendingUp, title: '98% Approval Rate', desc: 'Industry-leading success rate across all visa categories' },
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon size={22} className="text-royal-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">{feature.title}</div>
                        <div className="text-slate-400 text-sm">{feature.desc}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="glass-premium rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-royal-500/20 to-teal-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Free Consultation</h3>
                  <p className="text-slate-400 mb-8">Get expert advice on your immigration journey</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="label">Full Name</label>
                      <input
                        className="input-glass"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Email</label>
                        <input
                          className="input-glass"
                          type="email"
                          placeholder="john@email.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Phone</label>
                        <input
                          className="input-glass"
                          placeholder="+1 234 567 890"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Service Needed</label>
                      <select
                        className="input-glass"
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        required
                      >
                        <option value="">Select service...</option>
                        <option value="work-permit">Work Permit</option>
                        <option value="study-visa">Study Visa</option>
                        <option value="immigration">Immigration / PR</option>
                        <option value="job-assistance">Job Assistance</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Message (Optional)</label>
                      <textarea
                        className="input-glass"
                        rows="3"
                        placeholder="Tell us about your situation..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn-primary w-full"
                    >
                      {submitted ? 'Request Sent!' : 'Book Free Consultation'}
                    </motion.button>
                  </form>
                  
                  <p className="text-xs text-slate-500 text-center mt-4">
                    No commitment required - Response within 2 hours
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="section-pad relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)' }}>
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="badge badge-teal mx-auto mb-4">
              <Star size={12} className="fill-current" /> Testimonials
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Client <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Don&apos;t just take our word for it. Here&apos;s what our clients have to say.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 lg:p-8 relative"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <Star key={idx} size={16} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                  &quot;{testimonial.text}&quot;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-500 text-xs">{testimonial.country}</div>
                  </div>
                </div>
                
                {/* Visa Badge */}
                <div className="absolute top-6 right-6">
                  <div className="badge badge-teal text-xs">{testimonial.visa}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-500/10 via-teal-500/5 to-royal-500/10" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-premium rounded-3xl p-12 lg:p-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to Start Your Journey?
              </h2>
              <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto">
                Take the first step towards your international dreams. 
                Book a free consultation with our certified experts today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/programs">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    Explore Programs <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <a href="https://wa.me/18005558472" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline flex items-center gap-2"
                  >
                    <MessageCircle size={18} /> WhatsApp Us
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
