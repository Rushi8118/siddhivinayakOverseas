import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Users, FileText, TrendingUp, Shield, Settings, LayoutDashboard } from 'lucide-react'
import toast from 'react-hot-toast'

const metrics = [
  { label: 'Total Users', value: '12,480', change: '+5.2%', icon: Users, color: 'from-royal-500 to-teal-500' },
  { label: 'Applications', value: '1,237', change: '+3.1%', icon: FileText, color: 'from-teal-500 to-royal-500' },
  { label: 'Conversion', value: '7.4%', change: '+0.8%', icon: TrendingUp, color: 'from-gold-500 to-royal-500' },
]

const recent = [
  { name: 'Aarav Sharma', program: 'Canada PR', status: 'New', date: 'Apr 10' },
  { name: 'Priya Desai', program: 'Study Visa', status: 'In Review', date: 'Apr 09' },
  { name: 'Vikram Patel', program: 'Work Permit', status: 'Approved', date: 'Apr 08' },
  { name: 'Neha Gupta', program: 'Australia PR', status: 'New', date: 'Apr 08' },
]

export default function AdminPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login')
      } else if (user.email !== 'admin@siddhivinayakoverseas.com') {
        toast.error('Access denied. Admin privileges required.')
        navigate('/dashboard')
      }
    }
  }, [user, loading, navigate])

  if (loading) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="text-slate-400">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="border-b border-white/5 bg-gradient-to-b from-navy-900/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm">Overview and quick actions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/" className="btn-outline">Back to Site</Link>
              <button className="btn-primary flex items-center gap-2"><Settings size={16} /> Settings</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-premium rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{m.label}</p>
                  <p className="text-2xl font-bold mt-1">{m.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                  <m.icon size={20} />
                </div>
              </div>
              <div className="mt-4 text-sm text-teal-400">Change {m.change}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Applications</h2>
              <button className="btn-outline">View All</button>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="text-left px-4 py-3">Applicant</th>
                    <th className="text-left px-4 py-3">Program</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">{r.name}</td>
                      <td className="px-4 py-3 text-slate-300">{r.program}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-royal-500/20 text-royal-300">{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-teal-400" />
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full btn-primary">New Announcement</button>
              <button className="w-full btn-outline">Review Pending</button>
              <button className="w-full btn-outline">Manage Programs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
