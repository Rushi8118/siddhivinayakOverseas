import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { CheckCircle, Briefcase, GraduationCap, Globe, Clock, DollarSign, Users, ArrowRight, MessageCircle } from 'lucide-react'

const countryData = {
  canada: {
    name: 'Canada',
    flag: '🇨🇦',
    tagline: 'The Land of Opportunity',
    description: 'Canada is one of the world\'s most immigrant-friendly nations, offering diverse pathways to permanent residency, excellent quality of life, universal healthcare, and top-ranked universities.',
    gradient: 'from-red-600/30 to-red-800/20',
    stats: [
      { label: 'Annual Immigrants', value: '400K+' },
      { label: 'GDP Growth', value: '3.2%' },
      { label: 'Quality of Life', value: 'Top 5' },
      { label: 'Avg. Salary', value: '$65K CAD' },
    ],
    visaTypes: [
      { name: 'Express Entry (PR)', type: 'Permanent Residency', time: '3-6 months', points: '470+ CRS', color: 'badge-gold' },
      { name: 'Provincial Nominee Program', type: 'Permanent Residency', time: '6-12 months', points: 'Varies by province', color: 'badge-teal' },
      { name: 'Work Permit (LMIA)', type: 'Temporary Work', time: '2-4 months', points: 'Job offer required', color: 'badge-purple' },
      { name: 'Student Visa', type: 'Study Permit', time: '4-8 weeks', points: 'Admission required', color: 'badge-gold' },
      { name: 'Family Sponsorship', type: 'Family Reunification', time: '12-24 months', points: 'PR sponsor required', color: 'badge-teal' },
      { name: 'Start-Up Visa', type: 'Business Immigration', time: '12-16 months', points: 'Business plan required', color: 'badge-purple' },
    ],
    topJobs: ['Software Engineer', 'Registered Nurse', 'Civil Engineer', 'Truck Driver', 'Electrician', 'Financial Analyst'],
    requirements: ['Valid passport', 'Language test (IELTS/TEF)', 'Educational credential assessment', 'Work experience proof', 'Funds proof', 'Medical exam', 'Police clearance'],
    pathways: [
      { title: 'Express Entry', desc: 'Points-based system for skilled workers. Score 470+ CRS points for an invitation to apply for PR.' },
      { title: 'Provincial Programs', desc: '13 provinces each run their own immigration programs targeting specific skills and labour needs.' },
      { title: 'Canadian Experience Class', desc: 'For those with existing Canadian work or study experience to obtain permanent residency.' },
    ],
  },
  australia: {
    name: 'Australia',
    flag: '🇦🇺',
    tagline: 'Sun, Success & Opportunity',
    description: 'Australia offers world-class lifestyle, strong economy, and multiple skilled migration pathways. Known for high wages, excellent healthcare, and stunning natural beauty.',
    gradient: 'from-yellow-600/30 to-orange-700/20',
    stats: [
      { label: 'Annual Immigrants', value: '200K+' },
      { label: 'Min. Wage', value: '$23/hr AUD' },
      { label: 'Ranking', value: 'Top 10 HD' },
      { label: 'Avg. Salary', value: '$85K AUD' },
    ],
    visaTypes: [
      { name: 'Skilled Independent (189)', type: 'Permanent Residency', time: '6-12 months', points: '65+ points', color: 'badge-gold' },
      { name: 'Skilled Nominated (190)', type: 'Permanent Residency', time: '6-9 months', points: '65+ points + nomination', color: 'badge-teal' },
      { name: 'Temporary Skill Shortage (482)', type: 'Temporary Work', time: '2-3 months', points: 'Employer sponsor', color: 'badge-purple' },
      { name: 'Student Visa (500)', type: 'Study', time: '4-6 weeks', points: 'University admission', color: 'badge-gold' },
      { name: 'Working Holiday (417)', type: 'Work & Travel', time: '2-4 weeks', points: '18-30 years old', color: 'badge-teal' },
    ],
    topJobs: ['Nurse', 'IT Professional', 'Civil Engineer', 'Chef', 'Teacher', 'Accountant'],
    requirements: ['Valid passport', 'Skills assessment', 'English test (IELTS 6.0+)', 'Health examination', 'Character requirements', 'Expression of Interest (EOI)', 'Proof of funds'],
    pathways: [
      { title: 'SkillSelect System', desc: 'Submit an Expression of Interest and receive invitations based on your points score and in-demand occupations.' },
      { title: 'State/Territory Nomination', desc: 'Get nominated by an Australian state to gain extra points or access dedicated visa streams.' },
      { title: 'Employer Sponsorship', desc: 'Secure employer sponsorship for TSS visa, which can lead to permanent residency after 3 years.' },
    ],
  },
  germany: {
    name: 'Germany',
    flag: '🇩🇪',
    tagline: 'Innovation & Quality of Life',
    description: 'Germany is Europe\'s largest economy with a strong demand for skilled workers. The new Skilled Immigration Act makes it easier than ever to relocate and build a career.',
    gradient: 'from-yellow-500/20 to-slate-700/20',
    stats: [
      { label: 'Skilled Worker Demand', value: '400K+/yr' },
      { label: 'Min. Wage', value: '€12.41/hr' },
      { label: 'EU Access', value: 'Free Move' },
      { label: 'Avg. Salary', value: '€50K' },
    ],
    visaTypes: [
      { name: 'EU Blue Card', type: 'Skilled Work', time: '1-3 months', points: 'Degree + €58K salary', color: 'badge-gold' },
      { name: 'Skilled Worker Visa', type: 'Employment', time: '4-8 weeks', points: 'Recognized qualification', color: 'badge-teal' },
      { name: 'Job Seeker Visa', type: 'Search Visa', time: '2-4 weeks', points: 'Degree + funds proof', color: 'badge-purple' },
      { name: 'Student Visa', type: 'Study', time: '4-8 weeks', points: 'University admission', color: 'badge-gold' },
      { name: 'Opportunity Card', type: 'Points-Based', time: '4-8 weeks', points: '6+ points on system', color: 'badge-teal' },
    ],
    topJobs: ['Software Developer', 'Mechanical Engineer', 'Doctor', 'Nurse', 'Electrician', 'Data Scientist'],
    requirements: ['Valid passport', 'Recognized degree/qualification', 'Job offer (for most visas)', 'German language (B1/B2 for some)', 'Blocked account (€11,208)', 'Health insurance', 'CV in German format'],
    pathways: [
      { title: 'EU Blue Card', desc: 'Fastest route for non-EU professionals with a degree and job offer above the salary threshold.' },
      { title: 'Opportunity Card', desc: 'New points-based pre-immigration visa allowing you to come to Germany and search for jobs.' },
      { title: 'Settlement Permit', desc: 'After 4 years (2 with exceptional integration), you can apply for permanent settlement in Germany.' },
    ],
  },
  uk: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    tagline: 'Gateway to Global Opportunities',
    description: 'The UK offers world-class education, diverse career opportunities, and a vibrant multicultural society. The points-based immigration system welcomes skilled talent globally.',
    gradient: 'from-blue-700/30 to-red-700/20',
    stats: [
      { label: 'GDP', value: '$3.1T' },
      { label: 'Universities', value: 'Top 10' },
      { label: 'Min. Wage', value: '£11.44/hr' },
      { label: 'Avg. Salary', value: '£35K' },
    ],
    visaTypes: [
      { name: 'Skilled Worker Visa', type: 'Employment', time: '3-8 weeks', points: '70 points required', color: 'badge-gold' },
      { name: 'Graduate Visa', type: 'Post-Study', time: '4-8 weeks', points: 'UK degree holder', color: 'badge-teal' },
      { name: 'Student Visa', type: 'Study', time: '3 weeks', points: 'CAS from university', color: 'badge-purple' },
      { name: 'Health & Care Visa', type: 'NHS Jobs', time: '2-3 weeks', points: 'Healthcare role', color: 'badge-gold' },
      { name: 'Global Talent Visa', type: 'Exceptional Talent', time: '5-8 weeks', points: 'Endorsement required', color: 'badge-teal' },
    ],
    topJobs: ['NHS Nurse', 'IT Engineer', 'Finance Professional', 'Teacher', 'Chef', 'Care Worker'],
    requirements: ['Valid passport', 'Certificate of Sponsorship (CoS)', 'English language proof', 'Maintenance funds', 'Tuberculosis test (some nationalities)', 'Job offer letter', 'Qualifications proof'],
    pathways: [
      { title: 'Skilled Worker Route', desc: 'Points-based system requiring a job offer from a licensed sponsor with salary meeting the threshold.' },
      { title: 'Graduate Route', desc: 'International students can stay 2-3 years after graduation to work or look for work in the UK.' },
      { title: 'Indefinite Leave to Remain', desc: 'After 5 years on eligible visas, you can apply for ILR (permanent residency) in the UK.' },
    ],
  },
  usa: {
    name: 'United States',
    flag: '🇺🇸',
    tagline: 'The American Dream Awaits',
    description: 'The USA remains the world\'s top destination for ambitious professionals and students. With the largest economy globally, opportunities span every industry and sector.',
    gradient: 'from-blue-600/30 to-red-600/20',
    stats: [
      { label: 'GDP', value: '$27T' },
      { label: 'Fortune 500', value: 'HQ Hub' },
      { label: 'Min. Wage', value: '$7.25/hr' },
      { label: 'Tech Salaries', value: '$150K+' },
    ],
    visaTypes: [
      { name: 'H-1B Visa', type: 'Specialty Occupation', time: '3-6 months', points: 'Employer sponsor + lottery', color: 'badge-gold' },
      { name: 'L-1 Intracompany', type: 'Transfer', time: '2-4 months', points: 'Intracompany transfer', color: 'badge-teal' },
      { name: 'F-1 Student Visa', type: 'Study', time: '2-8 weeks', points: 'University I-20', color: 'badge-purple' },
      { name: 'O-1 Extraordinary', type: 'Extraordinary Ability', time: '2-4 months', points: 'Exceptional achievements', color: 'badge-gold' },
      { name: 'EB-5 Investor', type: 'Investment Green Card', time: '2-4 years', points: '$800K+ investment', color: 'badge-teal' },
      { name: 'Green Card (EB-2/3)', type: 'Permanent Residency', time: '1-10 years', points: 'Employer sponsor', color: 'badge-purple' },
    ],
    topJobs: ['Software Engineer', 'Data Scientist', 'Doctor', 'Financial Analyst', 'Marketing Manager', 'Civil Engineer'],
    requirements: ['Valid passport', 'Employer sponsorship (work visas)', 'Educational qualifications', 'Job offer letter', 'Labor Condition Application (LCA)', 'Prevailing wage compliance', 'Background check'],
    pathways: [
      { title: 'H-1B to Green Card', desc: 'The most common path: secure H-1B sponsorship, then employer files for PERM and Green Card.' },
      { title: 'EB-1 Priority Workers', desc: 'For extraordinary ability, outstanding professors/researchers, or multinational managers.' },
      { title: 'STEM OPT Extension', desc: 'F-1 students in STEM fields get 3 years of OPT, providing time to transition to H-1B.' },
    ],
  },
}

export default function CountryPage() {
  const { country } = useParams()
  const data = countryData[country]

  if (!data) {
    return (
      <div className="min-h-screen bg-navy-950 pt-32 text-center">
        <h1 className="text-white text-3xl font-bold">Country not found</h1>
        <p className="text-slate-400 mt-2">Available: canada, australia, germany, uk, usa</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Hero */}
      <section className={`hero-bg py-20 relative overflow-hidden`}>
        <div className="dot-pattern absolute inset-0 opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-7xl mb-4">{data.flag}</div>
            <div className="badge badge-gold mx-auto mb-4">{data.tagline}</div>
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Immigrate to <span className="gradient-text">{data.name}</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">{data.description}</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {data.stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-display text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Visa Types */}
        <div>
          <div className="badge badge-gold mb-4">Visa Options</div>
          <h2 className="font-display text-3xl font-bold text-white mb-8">Available Visa Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.visaTypes.map((v, i) => (
              <motion.div key={v.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass rounded-xl p-5 hover:border-white/20 border border-transparent transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold">{v.name}</h3>
                  <span className={`badge ${v.color} text-xs flex-shrink-0`}>{v.type}</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex gap-2 text-slate-400"><Clock size={13} className="text-gold-400 mt-0.5" /><span>{v.time}</span></div>
                  <div className="flex gap-2 text-slate-400"><CheckCircle size={13} className="text-teal-400 mt-0.5" /><span>{v.points}</span></div>
                </div>
                <button className="btn-primary text-xs px-4 py-2 mt-4 flex items-center gap-1.5">
                  Apply Now <ArrowRight size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Requirements */}
          <div>
            <div className="badge badge-teal mb-4">Requirements</div>
            <h2 className="font-display text-3xl font-bold text-white mb-6">General Requirements</h2>
            <div className="space-y-2">
              {data.requirements.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                  className="flex items-center gap-3 p-3 glass rounded-lg">
                  <CheckCircle size={15} className="text-teal-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{r}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Job Opportunities */}
          <div>
            <div className="badge badge-purple mb-4">Job Market</div>
            <h2 className="font-display text-3xl font-bold text-white mb-6">In-Demand Occupations</h2>
            <div className="grid grid-cols-2 gap-3">
              {data.topJobs.map((job, i) => (
                <motion.div key={job} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  className="glass rounded-lg p-3 flex items-center gap-2">
                  <Briefcase size={14} className="text-gold-400" />
                  <span className="text-slate-300 text-sm">{job}</span>
                </motion.div>
              ))}
            </div>

            {/* Pathways */}
            <div className="mt-8">
              <div className="badge badge-gold mb-4">Pathways</div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">Immigration Pathways</h2>
              <div className="space-y-3">
                {data.pathways.map((p, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-xs text-gold-400 font-bold">{i + 1}</div>
                      <h4 className="text-white font-semibold text-sm">{p.title}</h4>
                    </div>
                    <p className="text-slate-400 text-sm pl-8">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="glass rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-teal-500/10" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">{data.flag}</div>
            <h3 className="font-display text-3xl font-bold text-white mb-3">Ready to Move to {data.name}?</h3>
            <p className="text-slate-400 mb-6">Get a free assessment of your eligibility and start your immigration journey today.</p>
            <div className="flex gap-4 justify-center">
              <button className="btn-primary flex items-center gap-2">Free Assessment <ArrowRight size={16} /></button>
              <a href="https://wa.me/18005558472" target="_blank" rel="noopener noreferrer">
                <button className="btn-outline flex items-center gap-2"><MessageCircle size={15} /> Chat with Expert</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}