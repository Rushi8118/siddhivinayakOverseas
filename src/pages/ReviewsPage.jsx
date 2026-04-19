import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import SEO from '../components/SEO'
import { customerReviews, getReviewInitials } from '../data/reviews'

export default function ReviewsPage() {
  const [activeCountry, setActiveCountry] = useState('All')

  const countryFilters = useMemo(() => (
    ['All', ...new Set(customerReviews.map((review) => review.country.split(' to ').pop()))]
  ), [])

  const filteredReviews = useMemo(() => (
    activeCountry === 'All'
      ? customerReviews
      : customerReviews.filter((review) => review.country.endsWith(activeCountry))
  ), [activeCountry])

  return (
    <div className="bg-navy-950 min-h-screen">
      <SEO
        title="Customer Reviews"
        description="Read real customer reviews for Siddhivinayak Overseas work visa services across Australia, New Zealand, UK, Europe, and Russia."
        keywords="Siddhivinayak Overseas reviews, work visa reviews, visa consultancy testimonials"
      />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <div className="badge badge-teal mx-auto mb-4">
              <Star size={12} className="fill-current" /> Customer Reviews
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Real Feedback From Our <span className="gradient-text">Clients</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              A few honest words from clients who trusted Siddhivinayak Overseas with their work visa journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {countryFilters.map((country) => {
              const isActive = activeCountry === country
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => setActiveCountry(country)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-navy-950 border-gold-500'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {country}
                </button>
              )
            })}
          </motion.div>

          <div className="text-center text-sm text-slate-400 mb-8">
            Showing <span className="text-white font-medium">{filteredReviews.length}</span> reviews
            {activeCountry !== 'All' ? ` for ${activeCountry}` : ''}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={`${review.name}-${review.country}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 lg:p-8 relative"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, ratingIndex) => (
                    <Star key={ratingIndex} size={16} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                  &quot;{review.text}&quot;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {getReviewInitials(review.name)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{review.name}</div>
                    <div className="text-slate-500 text-xs">{review.country}</div>
                  </div>
                </div>

                <div className="absolute top-6 right-6">
                  <div className="badge badge-teal text-xs">{review.visa}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
              No reviews found for this country yet.
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link to="/contact">
              <button className="btn-primary inline-flex items-center gap-2">
                Start Your Process <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
