import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Briefcase, GraduationCap, CheckCircle, Clock, FileText, ArrowRight,
  Users, Award, Globe, Star, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react'
import toast from 'react-hot-toast'

function ProcessStep({ step, title, desc, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: step * 0.1 }}
      viewport={{ once: true }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-950 font-bold text-sm flex-shrink-0">
          {step}
        </div>
        {step < 5 && <div className="w-px flex-1 bg-gradient-to-b from-gold-500/40 to-transparent mt-2 min-h-8" />}
      </div>
      <div className="pb-8">
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setOpen(!open)}>
        <span className="text-white font-medium text-sm">{q}</span>
        {open ? <ChevronUp size={16} className="text-gold-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{a}</div>}
    </div>
  )
}

function ConsultationForm({ serviceType }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success('Consultation request submitted! We\'ll contact you within 2 hours.')
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display text-xl font-bold text-white mb-1">Book a Free Consultation</h3>
      <p className="text-slate-400 text-sm mb-5">Get expert advice on {serviceType}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Name</label>
            <input className="input-glass" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input-glass" placeholder="+1 234 567" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input-glass" type="email" placeholder="john@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div>
          <label className="label">Preferred Country</label>
          <select className="input-glass" value={form.country} onChange={e => setForm({...form, country: e.target.value})} required>
            <option value="">Select country...</option>
            {['Canada', 'Australia', 'Germany', 'UK', 'USA', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Message (Optional)</label>
          <textarea className="input-glass" rows="3" placeholder="Tell us about your situation..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Submitting...' : 'Book Free Consultation'}
        </button>
      </form>
    </div>
  )
}

function ServicePageTemplate({ title, subtitle, badge, icon: Icon, color, gradient, process, documents, faqs, stats, serviceType }) {
  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero */}
      <section className="hero-bg py-20 relative overflow-hidden">
        <div className="dot-pattern absolute inset-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="badge badge-gold mb-4">{badge}</div>
              <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">{title}</h1>
              <p className="text-slate-400 leading-relaxed mb-8">{subtitle}</p>
              <div className="flex gap-3">
                <button className="btn-primary flex items-center gap-2">Get Started <ArrowRight size={16} /></button>
                <a href="https://wa.me/18005558472" target="_blank" rel="noopener noreferrer">
                  <button className="btn-outline flex items-center gap-2"><MessageCircle size={15} /> WhatsApp</button>
                </a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className={`w-full h-64 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="dot-pattern absolute inset-0" />
                <Icon size={80} className="text-white opacity-20 relative z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="grid grid-cols-2 gap-4 p-6 w-full">
                    {stats.map(s => (
                      <div key={s.label} className="glass rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-white font-display">{s.value}</div>
                        <div className="text-xs text-slate-300">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Process */}
            <div>
              <div className="badge badge-teal mb-4">How It Works</div>
              <h2 className="font-display text-3xl font-bold text-white mb-8">Step-by-Step Process</h2>
              <div className="space-y-1">
                {process.map((p, i) => (
                  <ProcessStep key={i} step={i + 1} {...p} />
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <div className="badge badge-gold mb-4">Required Docs</div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Required Documents</h2>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                  {documents.map((doc, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-4 bg-navy-950"
                    >
                      <CheckCircle size={15} className="text-teal-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{doc}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <div className="badge badge-purple mb-4">FAQ</div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => <FAQ key={i} {...faq} />)}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-gold-400" />
                <h3 className="text-white font-semibold">Processing Times</h3>
              </div>
              <div className="space-y-3">
                {[
                  { country: '🇨🇦 Canada', time: '3-6 months' },
                  { country: '🇦🇺 Australia', time: '2-4 months' },
                  { country: '🇩🇪 Germany', time: '1-3 months' },
                  { country: '🇬🇧 UK', time: '3-8 weeks' },
                  { country: '🇺🇸 USA', time: '3-12 months' },
                ].map(p => (
                  <div key={p.country} className="flex justify-between text-sm">
                    <span className="text-slate-400">{p.country}</span>
                    <span className="text-white font-medium">{p.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <ConsultationForm serviceType={serviceType} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function WorkPermitPage() {
  return (
    <ServicePageTemplate
      title="Work Permit Services"
      subtitle="Navigate the complex world of international work authorization. Our certified consultants handle every aspect of your work permit application with precision and expertise."
      badge="Work Permit"
      icon={Briefcase}
      color="text-gold-400"
      gradient="from-gold-500/30 to-orange-600/20"
      serviceType="Work Permits"
      stats={[
        { value: '98%', label: 'Approval Rate' },
        { value: '8K+', label: 'Work Permits' },
        { value: '45+', label: 'Countries' },
        { value: '15Y', label: 'Experience' },
      ]}
      process={[
        { title: 'Free Assessment', desc: 'Complete our online assessment to determine your eligibility for work permits in your target country.' },
        { title: 'Document Collection', desc: 'Our team provides a personalized document checklist and guides you through gathering all required materials.' },
        { title: 'Application Preparation', desc: 'Certified consultants prepare and review your complete application package for accuracy and compliance.' },
        { title: 'Submission & Follow-up', desc: 'We submit your application and actively follow up with immigration authorities on your behalf.' },
        { title: 'Visa Approval & Travel', desc: 'Upon approval, we provide guidance on entry requirements, arrival procedures, and settlement support.' },
      ]}
      documents={[
        'Valid Passport (6+ months validity)', 'Job offer letter from employer', 'Educational certificates & transcripts',
        'Work experience letters', 'Professional credentials', 'Bank statements (3 months)', 'Medical examination report',
        'Police clearance certificate', 'Passport-size photographs', 'Completed application forms',
        'CV / Resume', 'Language test results (IELTS/TEF)',
      ]}
      faqs={[
        { q: 'How long does a work permit take?', a: 'Processing times vary by country: Canada 3-6 months, Germany 1-3 months, UK 3-8 weeks, Australia 2-4 months. Express processing options may be available.' },
        { q: 'Can my family join me?', a: 'Yes, most work permits allow dependents (spouse/children). We handle dependent visa applications alongside your main application.' },
        { q: 'Can a work permit lead to permanent residency?', a: 'Absolutely! Many work permits provide pathways to permanent residency. We guide you through the entire PR application process after arrival.' },
        { q: 'What if my application is rejected?', a: 'We have a 98% approval rate, but in rare cases of rejection, we analyze the refusal reasons and file appeals or reapplications at no extra cost.' },
      ]}
    />
  )
}

export function StudyVisaPage() {
  return (
    <ServicePageTemplate
      title="Study Visa Services"
      subtitle="Realize your academic dreams at world-class institutions. We handle your student visa from university selection to visa approval and beyond."
      badge="Study Visa"
      icon={GraduationCap}
      color="text-teal-400"
      gradient="from-teal-500/30 to-cyan-600/20"
      serviceType="Study Visas"
      stats={[
        { value: '15K+', label: 'Students Placed' },
        { value: '500+', label: 'Universities' },
        { value: '99%', label: 'Visa Success' },
        { value: '30+', label: 'Countries' },
      ]}
      process={[
        { title: 'University Selection', desc: 'We help you select the right university and program based on your profile, budget, and career goals.' },
        { title: 'Application & Admission', desc: 'Our team assists with university applications, SOP writing, and securing admission letters.' },
        { title: 'Financial Planning', desc: 'Guidance on tuition fees, living costs, scholarships, and education loan assistance.' },
        { title: 'Visa Application', desc: 'Complete student visa application preparation, including biometrics scheduling and interview coaching.' },
        { title: 'Pre-Departure Support', desc: 'Accommodation assistance, airport pickup coordination, and orientation for life in your new country.' },
      ]}
      documents={[
        'Valid passport', 'Admission/offer letter from university', 'Academic transcripts & certificates',
        'English proficiency test (IELTS/TOEFL)', 'Statement of Purpose (SOP)', 'Financial proof / sponsor letter',
        'Bank statements (6 months)', 'GIC or blocked account proof', 'Medical insurance', 'Study plan',
        'Photographs', 'Prior visa history documents',
      ]}
      faqs={[
        { q: 'Can I work while studying?', a: 'Yes! Most countries allow students to work part-time (20 hrs/week during term, full-time during breaks). Canada, Australia, Germany, and UK all have favorable work rules.' },
        { q: 'What IELTS score do I need?', a: 'Requirements vary by country and university. Generally 6.0-7.0 for Canada/Australia, 5.5-6.5 for UK, and B2 German for Germany. We can help you prepare.' },
        { q: 'Can I bring my family?', a: 'Most countries allow spouses of full-time students to accompany them. Children can attend local schools. We handle all dependent visa applications.' },
        { q: 'What happens after I graduate?', a: 'Most countries offer Post-Study Work Visas: Canada (PGWP up to 3 years), Australia (2-4 years), UK (2 years), Germany (18 months). These can lead to PR.' },
      ]}
    />
  )
}

export function JobAssistancePage() {
  return (
    <ServicePageTemplate
      title="Job Assistance Services"
      subtitle="Land your dream job abroad with our comprehensive career support. From resume optimization to interview coaching and employer connections."
      badge="Job Assistance"
      icon={Users}
      color="text-indigo-400"
      gradient="from-indigo-500/30 to-purple-600/20"
      serviceType="Job Assistance"
      stats={[
        { value: '20K+', label: 'Jobs Placed' },
        { value: '1000+', label: 'Employers' },
        { value: '6W', label: 'Avg. Time' },
        { value: '95%', label: 'Placement Rate' },
      ]}
      process={[
        { title: 'Profile Assessment', desc: 'We evaluate your skills, experience, and qualifications to identify the best job markets and roles for your profile.' },
        { title: 'Resume & LinkedIn Optimization', desc: 'Our experts create ATS-friendly resumes and optimize your LinkedIn profile for maximum visibility.' },
        { title: 'Job Search Strategy', desc: 'Targeted job applications, employer introductions, and access to our exclusive partner employer network.' },
        { title: 'Interview Preparation', desc: 'Mock interviews, cultural coaching, and salary negotiation guidance tailored to your target country.' },
        { title: 'Offer & Work Permit', desc: 'Once you receive a job offer, we handle the entire work permit application process seamlessly.' },
      ]}
      documents={[
        'Updated CV / Resume', 'Professional certifications', 'Work experience letters',
        'Educational credentials', 'Portfolio (if applicable)', 'Professional references',
        'LinkedIn profile URL', 'Cover letter templates', 'Skills assessment results',
        'Language certificates', 'Background check consent', 'Salary expectations letter',
      ]}
      faqs={[
        { q: 'How quickly can I find a job?', a: 'Our average placement time is 6-8 weeks depending on your field and target country. High-demand sectors like IT, healthcare, and engineering tend to be faster.' },
        { q: 'Do you guarantee a job offer?', a: 'While we cannot guarantee offers, our 95% placement rate speaks for itself. We work until you\'re successfully placed.' },
        { q: 'What industries do you specialize in?', a: 'IT & Tech, Healthcare, Engineering, Finance, Education, Construction, Hospitality, and more. We have employer networks across 45+ countries.' },
        { q: 'Is the service free?', a: 'We offer different packages. Basic job search guidance is included with our immigration services. Premium packages include direct employer introductions.' },
      ]}
    />
  )
}