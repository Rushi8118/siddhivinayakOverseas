import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Globe, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { resetPassword } from '../lib/supabaseClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setSubmitted(true)
      toast.success('Recovery email sent! Check your inbox.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-[300px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
            <Globe size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SiddhivinayakOverseas</span>
        </Link>
        
        <div className="glass-premium rounded-3xl p-8 lg:p-10">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
              <p className="text-slate-400 mb-2">
                We&apos;ve sent a password reset link to:
              </p>
              <p className="text-white font-medium mb-8">{email}</p>
              <p className="text-slate-500 text-sm mb-6">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full"
                >
                  Back to Login
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Reset your password</h2>
                <p className="text-slate-400">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="input-glass pl-12"
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 text-royal-400 hover:text-royal-300 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
