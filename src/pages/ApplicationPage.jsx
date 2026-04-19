import { motion } from 'framer-motion'
import { FileText, Phone, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createApplication } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { COUNTRY_CODES, detectCountryCode } from '../data/countryCodes'



// Reusable phone input with real-time country code auto-detection
function PhoneInput({ label, icon: Icon, codeKey, numberKey, formData, setFormData }) {
  const [detected, setDetected] = useState(null)

  const handleNumberChange = (e) => {
    const value = e.target.value
    const det = detectCountryCode(value)
    if (det) {
      setFormData(prev => ({ ...prev, [codeKey]: det.code, [numberKey]: det.number }))
      setDetected(det)
      // Clear the badge after 3 seconds
      setTimeout(() => setDetected(null), 3000)
    } else {
      setFormData(prev => ({ ...prev, [numberKey]: value }))
      setDetected(null)
    }
  }

  // Find flag for current selected code
  const currentFlag = COUNTRY_CODES.find(c => c.code === formData[codeKey])?.flag || ''

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-white flex items-center gap-2 text-sm font-medium">
          <Icon className="w-4 h-4 text-gold-400" />
          {label}
        </label>
        {detected && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', color: '#4ade80',
            background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: '9999px', padding: '2px 8px', animation: 'fadeIn 0.3s ease'
          }}>
            ✓ Detected {detected.flag} {detected.name}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          name={codeKey}
          value={formData[codeKey]}
          onChange={e => setFormData(prev => ({ ...prev, [codeKey]: e.target.value }))}
          className="input-field text-white bg-navy-900 shrink-0"
          style={{ width: '130px' }}
        >
          {COUNTRY_CODES.map((c, i) => (
            <option key={i} value={c.code} className="text-white bg-navy-900">
              {c.flag} {c.code} {c.name}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name={numberKey}
          value={formData[numberKey]}
          onChange={handleNumberChange}
          required
          placeholder={`e.g. ${formData[codeKey]} 9876543210`}
          className="input-field"
          style={{ flex: 1, minWidth: 0 }}
        />
      </div>
    </div>
  )
}

export default function ApplicationPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please log in to submit an application')
      navigate('/login?redirect=/apply')
    }
  }, [user, authLoading, navigate])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneCode: '+91',
    phone: '',
    whatsappCode: '+91',
    whatsapp: '',
    service: '',
    countryMain: '',
    countrySpecific: '',
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
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      // Build final country value
      const countryValue = (formData.countryMain === 'Europe' || formData.countryMain === 'Other')
        ? `${formData.countryMain} - ${formData.countrySpecific}`
        : formData.countryMain

      const applicationData = {
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: `${formData.phoneCode} ${formData.phone}`,
        whatsapp: `${formData.whatsappCode} ${formData.whatsapp}`,
        service: formData.service,
        country: countryValue,
        message: formData.message,
        status: 'pending'
      }

      const { data, error } = await createApplication(applicationData)

      if (error) throw error

      toast.success('Application submitted successfully!')
      setFormData({
        fullName: '', email: '',
        phoneCode: '+91', phone: '',
        whatsappCode: '+91', whatsapp: '',
        service: '', countryMain: '', countrySpecific: '', message: ''
      })
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
          {/* Full Name & Email */}
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

          {/* Phone Number */}
          <PhoneInput
            label="Phone Number"
            icon={Phone}
            codeKey="phoneCode"
            numberKey="phone"
            formData={formData}
            setFormData={setFormData}
          />

          {/* WhatsApp Number */}
          <PhoneInput
            label="WhatsApp Number"
            icon={MessageCircle}
            codeKey="whatsappCode"
            numberKey="whatsapp"
            formData={formData}
            setFormData={setFormData}
          />

          {/* Service */}
          <div>
            <label className="text-white mb-2 block text-sm font-medium">Service</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="input-field text-white bg-navy-900"
            >
              <option value="" className="text-slate-400 bg-navy-900">Select Service</option>
              <option value="work-permit" className="text-white bg-navy-900">Work Permit</option>
              <option value="study-visa" className="text-white bg-navy-900">Study Visa</option>
              {/* <option value="job-assistance" className="text-white bg-navy-900">Job Assistance</option> */}
            </select>
          </div>

          {/* Destination Country */}
          <div className="space-y-3">
            <label className="text-white mb-2 block text-sm font-medium">Destination Country</label>
            <select
              name="countryMain"
              value={formData.countryMain}
              onChange={handleChange}
              required
              className="input-field text-white bg-navy-900"
            >
              <option value="" className="text-slate-400 bg-navy-900">Select a country</option>
              <option value="Australia" className="text-white bg-navy-900">🇦🇺 Australia</option>
              <option value="New Zealand" className="text-white bg-navy-900">🇳🇿 New Zealand</option>
              <option value="United Kingdom" className="text-white bg-navy-900">🇬🇧 United Kingdom</option>
              <option value="Canada" className="text-white bg-navy-900">🇨🇦 Canada</option>
              <option value="Europe" className="text-white bg-navy-900">🇪🇺 Europe (specify below)</option>
              <option value="Other" className="text-white bg-navy-900">🌍 Other (specify below)</option>
            </select>

            {/* Show specific country input when Europe or Other is selected */}
            {(formData.countryMain === 'Europe' || formData.countryMain === 'Other') && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <input
                  type="text"
                  name="countrySpecific"
                  value={formData.countrySpecific}
                  onChange={handleChange}
                  required
                  placeholder={
                    formData.countryMain === 'Europe'
                      ? 'e.g. Germany, France, Netherlands…'
                      : 'Please enter the country name'
                  }
                  className="input-field"
                />
              </motion.div>
            )}
          </div>

          {/* Message */}
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