import { motion } from 'framer-motion'
import { GraduationCap, FileText, Clock, CheckCircle, Users, Award } from 'lucide-react'
import SEO from '../components/SEO'

function ProcessStep({ step, title, desc }) {
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

export default function StudyVisaPage() {
  return (
    <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <SEO 
        title="Study Visa Services" 
        description="Pursue quality education in top universities worldwide. Expert guidance for student visas in Canada, Australia, UK, and USA. From university selection to visa approval."
        keywords="study visa, student visa, Canada study permit, Australia student visa, UK student visa, USA F1 visa, study abroad, international students"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-gold-500" />
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">Study Visa</h1>
          <p className="text-xl text-slate-400">Pursue quality education in top universities worldwide</p>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold gradient-text mb-12 text-center">Application Process</h2>
          <ProcessStep step={1} title="University Selection" desc="Choose from thousands of certified institutions worldwide" />
          <ProcessStep step={2} title="Apply to University" desc="Submit application with academic documents and English proficiency test" />
          <ProcessStep step={3} title="Admission" desc="Receive acceptance letter from your chosen institution" />
          <ProcessStep step={4} title="Financial Proof" desc="Submit proof of funds for tuition and living expenses" />
          <ProcessStep step={5} title="Visa Processing" desc="Apply for student visa with complete documentation" />
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold gradient-text mb-12 text-center">Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Academic</h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• High school or bachelor's degree</li>
                <li>• Academic transcripts</li>
                <li>• IELTS/TOEFL scores</li>
                <li>• Statement of purpose</li>
                <li>• Letters of recommendation</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Financial</h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• Proof of funds</li>
                <li>• Bank statements</li>
                <li>• Sponsor documents</li>
                <li>• Tuition fees</li>
                <li>• Living expenses proof</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}