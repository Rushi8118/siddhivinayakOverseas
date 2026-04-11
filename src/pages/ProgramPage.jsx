import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Clock, CheckCircle, ArrowRight, Star, X } from 'lucide-react'

const allPrograms = [
  { id: 1, name: 'Canada Express Entry', country: 'Canada', flag: '🇨🇦', type: 'Permanent Residency', duration: 'Permanent', processing: '3-6 months', difficulty: 'Medium', popular: true, score: '470+ CRS', desc: 'Points-based federal immigration program for skilled workers.' },
  { id: 2, name: 'Canada PNP - Ontario', country: 'Canada', flag: '🇨🇦', type: 'Permanent Residency', duration: 'Permanent', processing: '6-12 months', difficulty: 'Medium', popular: false, score: 'Varies', desc: 'Provincial nominee program targeting Ontario labour market needs.' },
  { id: 3, name: 'Australia Skilled Independent', country: 'Australia', flag: '🇦🇺', type: 'Permanent Residency', duration: 'Permanent', processing: '6-12 months', difficulty: 'Medium', popular: true, score: '65+ Points', desc: 'Points-tested permanent residency for skilled workers not sponsored.' },
  { id: 4, name: 'Germany EU Blue Card', country: 'Germany', flag: '🇩🇪', type: 'Work Permit', duration: '4 years', processing: '1-3 months', difficulty: 'Low', popular: true, score: '€58K salary', desc: 'Fast-track work permit for non-EU highly qualified professionals.' },
  { id: 5, name: 'Germany Opportunity Card', country: 'Germany', flag: '🇩🇪', type: 'Job Seeker', duration: '1 year', processing: '4-8 weeks', difficulty: 'Low', popular: false, score: '6+ Points', desc: 'Points-based visa to come to Germany and search for skilled jobs.' },
  { id: 6, name: 'UK Skilled Worker Visa', country: 'UK', flag: '🇬🇧', type: 'Work Permit', duration: '5 years', processing: '3-8 weeks', difficulty: 'Low', popular: true, score: '70 Points', desc: 'Points-based work visa requiring employer sponsorship in the UK.' },
  { id: 7, name: 'UK Graduate Visa', country: 'UK', flag: '🇬🇧', type: 'Post-Study', duration: '2 years', processing: '4-8 weeks', difficulty: 'Low', popular: false, score: 'UK Degree', desc: 'Allows UK graduates to stay and work or look for work after study.' },
  { id: 8, name: 'USA H-1B Visa', country: 'USA', flag: '🇺🇸', type: 'Work Permit', duration: '3+3 years', processing: '3-6 months', difficulty: 'High', popular: true, score: 'Lottery', desc: 'Specialty occupation visa for US employer-sponsored skilled workers.' },
  { id: 9, name: 'USA EB-2 Green Card', country: 'USA', flag: '🇺🇸', type: 'Permanent Residency', duration: 'Permanent', processing: '1-10 years', difficulty: 'High', popular: false, score: 'Advanced Degree', desc: 'Employer-sponsored green card for advanced degree professionals.' },
  { id: 10, name: 'Australia TSS Visa 482', country: 'Australia', flag: '🇦🇺', type: 'Work Permit', duration: '2-4 years', processing: '2-4 months', difficulty: 'Medium', popular: false, score: 'Employer Sponsor', desc: 'Temporary skill shortage visa with employer sponsorship in Australia.' },
  { id: 11, name: 'Canada Study Permit', country: 'Canada', flag: '🇨🇦', type: 'Study Visa', duration: 'Course length', processing: '4-8 weeks', difficulty: 'Low', popular: true, score: 'Admission letter', desc: 'Study in Canada at DLI institutions with post-graduation work rights.' },
  { id: 12, name: 'Australia Student Visa 500', country: 'Australia', flag: '🇦🇺', type: 'Study Visa', duration: 'Course length', processing: '4-6 weeks', difficulty: 'Low', popular: false, score: 'IELTS 5.5+', desc: 'Study in Australia with work rights of 48 hours per fortnight.' },
]

const countries = ['All', 'Canada', 'Australia', 'Germany', 'UK', 'USA']
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
                className="input-glass pl-12 pr-4 py-4 text-base rounded-xl"
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
              showFilters || activeFilterCount > 0 
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
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filters.country === c ? 'bg-gold-500 text-navy-950 font-semibold' : 'glass text-slate-400 hover:text-white'
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
                  <select className="input-glass" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Duration</label>
                  <select className="input-glass" value={filters.duration} onChange={e => setFilters(f => ({ ...f, duration: e.target.value }))}>
                    {durations.map(d => <option key={d} value={d}>{d}</option>)}
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