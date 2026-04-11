import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'Top Countries for Immigration in 2024',
    author: 'Sarah Johnson',
    date: 'April 8, 2024',
    excerpt: 'Discover the best destinations for your career and lifestyle goals this year.',
    image: '#'
  },
  {
    id: 2,
    title: 'Complete Guide to Work Visa Applications',
    author: 'Mike Chen',
    date: 'April 1, 2024',
    excerpt: 'Everything you need to know about applying for work visas internationally.',
    image: '#'
  },
  {
    id: 3,
    title: 'Study Abroad: Funding Your Education',
    author: 'Emma Davis',
    date: 'March 25, 2024',
    excerpt: 'Explore scholarships and financial aid options for international students.',
    image: '#'
  },
  {
    id: 4,
    title: 'Immigration Interview Tips and Tricks',
    author: 'James Wilson',
    date: 'March 18, 2024',
    excerpt: 'How to ace your immigration interview and make the best impression.',
    image: '#'
  }
]

export default function BlogPage() {
  return (
    <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 min-h-screen pt-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">Blog</h1>
          <p className="text-xl text-slate-400">Immigration insights and expert advice</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-gold-500/50 transition"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-500 transition">
                  {post.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                </div>

                <p className="text-slate-400 mb-6">{post.excerpt}</p>

                <button className="flex items-center gap-2 text-gold-500 hover:text-gold-400 transition">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}