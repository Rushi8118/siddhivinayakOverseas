import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Clock, CheckCircle, ArrowRight, Star, X } from 'lucide-react'
import SEO from '../components/SEO'

const allPrograms = [
  // ─── Canada ───
  { id: 1, name: 'Canada Express Entry', country: 'Canada', flag: '🇨🇦', type: 'Permanent Residency', duration: 'Permanent', processing: '3-6 months', difficulty: 'Medium', popular: true, score: '470+ CRS', desc: 'Points-based federal immigration program for skilled workers.' },
  { id: 2, name: 'Canada PNP - Ontario', country: 'Canada', flag: '🇨🇦', type: 'Permanent Residency', duration: 'Permanent', processing: '6-12 months', difficulty: 'Medium', popular: false, score: 'Varies', desc: 'Provincial nominee program targeting Ontario labour market needs.' },
  { id: 3, name: 'Canada Study Permit', country: 'Canada', flag: '🇨🇦', type: 'Study Visa', duration: 'Course length', processing: '4-8 weeks', difficulty: 'Low', popular: true, score: 'Admission letter', desc: 'Study in Canada at DLI institutions with post-graduation work rights.' },
  { id: 4, name: 'Canada Open Work Permit', country: 'Canada', flag: '🇨🇦', type: 'Work Permit', duration: '1-2 years', processing: '2-4 months', difficulty: 'Low', popular: false, score: 'Varies', desc: 'Work for any employer in Canada without a job offer required.' },
  // ─── Australia ───
  { id: 5, name: 'Australia Skilled Independent (189)', country: 'Australia', flag: '🇦🇺', type: 'Permanent Residency', duration: 'Permanent', processing: '6-12 months', difficulty: 'Medium', popular: true, score: '65+ Points', desc: 'Points-tested permanent residency for skilled workers not sponsored.' },
  { id: 6, name: 'Australia TSS Visa 482', country: 'Australia', flag: '🇦🇺', type: 'Work Permit', duration: '2-4 years', processing: '2-4 months', difficulty: 'Medium', popular: false, score: 'Employer Sponsor', desc: 'Temporary skill shortage visa with employer sponsorship in Australia.' },
  { id: 7, name: 'Australia Student Visa 500', country: 'Australia', flag: '🇦🇺', type: 'Study Visa', duration: 'Course length', processing: '4-6 weeks', difficulty: 'Low', popular: true, score: 'IELTS 5.5+', desc: 'Study in Australia with 48 hrs/fortnight work rights.' },
  { id: 8, name: 'Australia State Nomination (190)', country: 'Australia', flag: '🇦🇺', type: 'Permanent Residency', duration: 'Permanent', processing: '6-14 months', difficulty: 'Medium', popular: false, score: '65+ Points', desc: 'State-nominated permanent residency for skilled workers.' },
  // ─── New Zealand ───
  { id: 9, name: 'NZ Skilled Migrant Category', country: 'New Zealand', flag: '🇳🇿', type: 'Permanent Residency', duration: 'Permanent', processing: '6-12 months', difficulty: 'Medium', popular: true, score: '100+ Points', desc: 'Points-based residence visa for skilled workers in New Zealand.' },
  { id: 10, name: 'NZ Essential Skills Work Visa', country: 'New Zealand', flag: '🇳🇿', type: 'Work Permit', duration: '3 years', processing: '5-10 weeks', difficulty: 'Low', popular: false, score: 'Job offer req.', desc: 'Work visa for people with a job offer from a NZ employer.' },
  { id: 11, name: 'NZ Student Visa', country: 'New Zealand', flag: '🇳🇿', type: 'Study Visa', duration: 'Course length', processing: '3-6 weeks', difficulty: 'Low', popular: false, score: 'IELTS 5.5+', desc: 'Study at a NZ institution with part-time work rights.' },
  // ─── United Kingdom ───
  { id: 12, name: 'UK Skilled Worker Visa', country: 'United Kingdom', flag: '🇬🇧', type: 'Work Permit', duration: '5 years', processing: '3-8 weeks', difficulty: 'Low', popular: true, score: '70 Points', desc: 'Points-based work visa requiring employer sponsorship in the UK.' },
  { id: 13, name: 'UK Graduate Visa', country: 'United Kingdom', flag: '🇬🇧', type: 'Post-Study', duration: '2 years', processing: '4-8 weeks', difficulty: 'Low', popular: false, score: 'UK Degree', desc: 'Allows UK graduates to stay and work after study.' },
  { id: 14, name: 'UK Student Visa', country: 'United Kingdom', flag: '🇬🇧', type: 'Study Visa', duration: 'Course length', processing: '3-6 weeks', difficulty: 'Low', popular: true, score: 'CAS from uni', desc: 'Study at a licensed UK higher education provider.' },
  // ─── Europe ───
  { id: 15, name: 'Germany EU Blue Card', country: 'Europe', flag: '🇩🇪', type: 'Work Permit', duration: '4 years', processing: '1-3 months', difficulty: 'Low', popular: true, score: '€58K salary', desc: 'Fast-track work permit for non-EU highly qualified professionals.' },
  { id: 16, name: 'Germany Opportunity Card', country: 'Europe', flag: '🇩🇪', type: 'Job Seeker', duration: '1 year', processing: '4-8 weeks', difficulty: 'Low', popular: false, score: '6+ Points', desc: 'Points-based visa to come to Germany and search for skilled jobs.' },
  { id: 17, name: 'Netherlands Highly Skilled Migrant', country: 'Europe', flag: '🇳🇱', type: 'Work Permit', duration: '5 years', processing: '2-4 weeks', difficulty: 'Low', popular: false, score: 'Salary threshold', desc: 'Expedited work permit for highly skilled non-EU nationals.' },
  { id: 18, name: 'France Talent Passport', country: 'Europe', flag: '🇫🇷', type: 'Work Permit', duration: '4 years', processing: '1-3 months', difficulty: 'Medium', popular: false, score: 'Degree + offer', desc: 'Multi-year French residence permit for skilled international talent.' },
  // ─── Other Countries ───
  { id: 19, name: 'Singapore Employment Pass', country: 'Other', flag: '🇸🇬', type: 'Work Permit', duration: '2 years', processing: '3-8 weeks', difficulty: 'Low', popular: true, score: 'S$5K salary', desc: 'Work permit for foreign professionals, managers, and executives in Singapore.' },
  { id: 20, name: 'UAE Golden Visa', country: 'Other', flag: '🇦🇪', type: 'Permanent Residency', duration: '5-10 years', processing: '4-8 weeks', difficulty: 'Low', popular: true, score: 'Investment/Talent', desc: 'Long-term UAE residency for investors, entrepreneurs, and skilled professionals.' },
  { id: 21, name: 'Japan Highly Skilled Professional', country: 'Other', flag: '🇯🇵', type: 'Work Permit', duration: '5 years', processing: '1-3 months', difficulty: 'Medium', popular: false, score: '70+ points', desc: 'Points-based work visa for highly skilled professionals seeking to work in Japan.' },
  { id: 22, name: 'Malaysia MM2H', country: 'Other', flag: '🇲🇾', type: 'Long Stay', duration: '5 years', processing: '3-6 months', difficulty: 'Low', popular: false, score: 'Income/funds', desc: 'Long-stay visa for Malaysia with renewable residency for retirees and investors.' },
]

const countries = ['All', 'Canada', 'Australia', 'New Zealand', 'United Kingdom', 'Europe', 'Other']
const types = ['All', 'Permanent Residency', 'Work Permit', 'Study Visa', 'Post-Study', 'Job Seeker']
const durations = ['All', 'Permanent', '1 year', '2 years', '4 years', '5 years', 'Course length']

const difficultyColor = {
  Low: 'text-teal-400',
  Medium: 'text-gold-400',
  High: 'text-red-400',
}

export default function ProgramsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ country: 'All', type: 'All', duration: 'All', popular: false })
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return allPrograms.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.country.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())
      const matchCountry = filters.country === 'All' || p.country === filters.country
      const matchType = filters.type === 'All' || p.type === filters.type
      const matchDuration = filters.duration === 'All' || p.duration === filters.duration
      const matchPopular = !filters.popular || p.popular
      return matchSearch && matchCountry && matchType && matchDuration && matchPopular
    })
  }, [search, filters])

  const activeFilterCount = [
    filters.country !== 'All', filters.type !== 'All', filters.duration !== 'All', filters.popular
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <SEO
        title="Immigration Programs & Visas"
        description="Explore 100+ immigration programs including Canada Express Entry, Australia Skilled Independent, UK Skilled Worker, and Germany Blue Card. Compare processing times and eligibility."
        keywords="Canada Express Entry, Australia PNP, UK Skilled Worker Visa, Germany Blue Card, USA H1B, immigration programs, visa eligibility"
      />
      {/* Hero */}
      <section className="hero-bg py-16 relative overflow-hidden">
        <div className="dot-pattern absolute inset-0 opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge badge-gold mx-auto mb-4">Program Search</div>
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Find Your <span className="gradient-text">Ideal Visa Program</span>
            </h1>
            <p className="text-slate-400 mb-8">Search and filter from 100+ immigration programs across 45+ countries</p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input-glass !pl-12 pr-4 py-4 text-base rounded-xl"
                placeholder="Search programs, countries, visa types..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${showFilters || activeFilterCount > 0
                ? 'border-gold-500 text-gold-400 bg-gold-500/10'
                : 'border-white/10 text-slate-400 hover:border-white/20'
              }`}
          >
            <Filter size={15} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Quick country filters */}
          <div className="flex flex-wrap gap-2">
            {countries.map(c => (
              <button key={c}
                onClick={() => setFilters(f => ({ ...f, country: c }))}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filters.country === c ? 'bg-gold-500 text-navy-950 font-semibold' : 'glass text-slate-400 hover:text-white'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="ml-auto text-sm text-slate-400">
            <span className="text-white font-semibold">{filtered.length}</span> programs found
          </div>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-xl p-5 mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">Visa Type</label>
                  <select className="input-glass text-white bg-navy-900" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                    {types.map(t => <option key={t} value={t} className="text-white bg-navy-900">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Duration</label>
                  <select className="input-glass text-white bg-navy-900" value={filters.duration} onChange={e => setFilters(f => ({ ...f, duration: e.target.value }))}>
                    {durations.map(d => <option key={d} value={d} className="text-white bg-navy-900">{d}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.popular} onChange={e => setFilters(f => ({ ...f, popular: e.target.checked }))}
                      className="w-4 h-4 accent-gold-500" />
                    <span className="text-slate-300 text-sm">Popular Only</span>
                  </label>
                </div>
                <div className="flex items-end">
                  <button onClick={() => setFilters({ country: 'All', type: 'All', duration: 'All', popular: false })}
                    className="text-sm text-slate-400 hover:text-gold-400 transition-colors">
                    Clear all
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((prog, i) => (
              <motion.div
                key={prog.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{prog.flag}</span>
                    <div>
                      <div className="text-xs text-slate-500">{prog.country}</div>
                      {prog.popular && (
                        <div className="flex items-center gap-1 text-xs text-gold-400">
                          <Star size={10} fill="currentColor" /> Popular
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="badge badge-teal text-xs">{prog.type}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{prog.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">{prog.desc}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Clock size={11} /> Processing</span>
                    <span className="text-white">{prog.processing}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><CheckCircle size={11} /> Requirement</span>
                    <span className="text-white">{prog.score}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Difficulty</span>
                    <span className={`font-semibold ${difficultyColor[prog.difficulty]}`}>{prog.difficulty}</span>
                  </div>
                </div>
                <button className="btn-primary text-sm py-2 flex items-center justify-center gap-1.5 w-full">
                  Apply Now <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white text-xl font-semibold mb-2">No programs found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}