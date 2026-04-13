import { motion } from 'framer-motion'
import { FileText, Upload, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { createApplication } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function ApplicationPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    country: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to submit an application')
      return
    }

    setLoading(true)
    try {
      const applicationData = {
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        country: formData.country,
        message: formData.message,
        status: 'pending'
      }

      const { data, error } = await createApplication(applicationData)

      if (error) throw error

      toast.success('Application submitted successfully!')
      setFormData({ fullName: '', email: '', phone: '', service: '', country: '', message: '' })
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 min-h-screen pt-32">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <FileText className="w-16 h-16 mx-auto mb-4 text-gold-500" />
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">Submit Application</h1>
          <p className="text-slate-400">Begin your immigration journey with us</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-white mb-2 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-white mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-white mb-2 block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 000-0000"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-white mb-2 block text-sm font-medium">Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Service</option>
                <option value="work-permit">Work Permit</option>
                <option value="study-visa">Study Visa</option>
                <option value="job-assistance">Job Assistance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-white mb-2 block text-sm font-medium">Destination Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Canada"
              className="input-field"
            />
          </div>

          <div>
            <label className="text-white mb-2 block text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Tell us about your background and goals..."
              className="input-field resize-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </motion.form>
      </div>
    </div>
  )
}