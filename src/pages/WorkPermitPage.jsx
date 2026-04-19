import { motion } from 'framer-motion'
import { Briefcase, FileText, Clock, CheckCircle, Users, Award, Globe } from 'lucide-react'
import SEO from '../components/SEO'

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
        {step < 4 && <div className="w-px flex-1 bg-gradient-to-b from-gold-500/40 to-transparent mt-2 min-h-8" />}
      </div>
      <div className="pb-8">
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

export default function WorkPermitPage() {
  return (
    <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <SEO 
        title="Work Permit Visa Services" 
        description="Expert assistance for securing work permits and employment visas in Canada, Australia, UK, and more. Full documentation support and eligibility assessment."
        keywords="work permit, employment visa, job visa, Canada work permit, Australia skilled worker visa, UK work visa"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Briefcase className="w-16 h-16 mx-auto mb-6 text-gold-500" />
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">Work Permit Visa</h1>
          <p className="text-xl text-slate-400">Secure your work permit for employment abroad</p>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold gradient-text mb-12 text-center">Application Process</h2>
          <ProcessStep step={1} title="Documentation" desc="Prepare required documents including passport, employment letter, and qualifications" icon={FileText} />
          <ProcessStep step={2} title="Assessment" desc="Our experts review your application and advise on eligibility" icon={CheckCircle} />
          <ProcessStep step={3} title="Processing" desc="Formal application submitted to immigration authorities" icon={Clock} />
          <ProcessStep step={4} title="Approval" desc="Receive your work permit and begin your professional journey" icon={Award} />
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold gradient-text mb-12 text-center">Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Documents</h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• Valid passport</li>
                <li>• Employment offer letter</li>
                <li>• Educational credentials</li>
                <li>• Police clearance</li>
                <li>• Medical examination</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Eligibility</h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• Minimum 18 years old</li>
                <li>• Valid job offer</li>
                <li>• Required qualifications</li>
                <li>• Good health status</li>
                <li>• No criminal record</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}