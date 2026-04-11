import { motion } from 'framer-motion'
import { Briefcase, FileText, Clock, CheckCircle, Users, Award } from 'lucide-react'

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
        {step < 4 && <div className="w-px flex-1 bg-gradient-to-b from-gold-500/40 to-transparent mt-2 min-h-8" />}
      </div>
      <div className="pb-8">
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

export default function JobAssistancePage() {
  return (
    <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Briefcase className="w-16 h-16 mx-auto mb-6 text-gold-500" />
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">Job Assistance</h1>
          <p className="text-xl text-slate-400">Get professional guidance to secure your dream job abroad</p>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold gradient-text mb-12 text-center">Our Process</h2>
          <ProcessStep step={1} title="Profile Assessment" desc="We evaluate your skills, experience, and career goals" />
          <ProcessStep step={2} title="Job Matching" desc="Connect with employers seeking skilled professionals" />
          <ProcessStep step={3} title="Interview Coaching" desc="Prepare for successful interviews with expert guidance" />
          <ProcessStep step={4} title="Job Placement" desc="Secure your position and receive visa sponsorship support" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold gradient-text mb-12 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Career Guidance</h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• Resume optimization</li>
                <li>• LinkedIn profile building</li>
                <li>• Career counseling</li>
                <li>• Skill development</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Job Support</h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• Job search assistance</li>
                <li>• Interview preparation</li>
                <li>• Visa sponsorship</li>
                <li>• Relocation support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}