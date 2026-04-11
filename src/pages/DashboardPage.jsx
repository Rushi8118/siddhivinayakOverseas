import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  User, FileText, Upload, Bell, CheckCircle, Clock, XCircle,
  Globe, TrendingUp, AlertCircle, ChevronRight, Plus, Download
} from 'lucide-react'
import toast from 'react-hot-toast'

const mockApplications = [
  { id: 1, type: 'Express Entry', country: '🇨🇦 Canada', status: 'In Review', date: '2025-01-10', progress: 65, color: 'text-gold-400' },
  { id: 2, type: 'Study Visa', country: '🇦🇺 Australia', status: 'Approved', date: '2024-12-20', progress: 100, color: 'text-teal-400' },
  { id: 3, type: 'Work Permit', country: '🇩🇪 Germany', status: 'Documents Required', date: '2025-01-05', progress: 35, color: 'text-red-400' },
]

const mockDocuments = [
  { name: 'Passport Copy.pdf', size: '2.4 MB', date: '2025-01-08', status: 'Verified' },
  { name: 'Education Certificate.pdf', size: '1.8 MB', date: '2025-01-07', status: 'Pending' },
  { name: 'Work Experience Letter.pdf', size: '0.9 MB', date: '2025-01-06', status: 'Verified' },
  { name: 'Bank Statement.pdf', size: '3.2 MB', date: '2025-01-05', status: 'Pending' },
]

const savedPrograms = [
  { name: 'Canada Express Entry', type: 'PR', points: 470, deadline: 'No Deadline', flag: '🇨🇦' },
  { name: 'Australia Skilled Migration', type: 'Skilled', points: 65, deadline: 'Rolling', flag: '🇦🇺' },
  { name: 'Germany EU Blue Card', type: 'Work', points: 'N/A', deadline: '30 days', flag: '🇩🇪' },
]

const statusIcon = (status) => {
  if (status === 'Approved') return <CheckCircle size={14} className="text-teal-400" />
  if (status === 'In Review') return <Clock size={14} className="text-gold-400" />
  return <AlertCircle size={14} className="text-red-400" />
}

const statusBadge = (status) => {
  if (status === 'Approved') return 'badge badge-teal text-xs'
  if (status === 'In Review') return 'badge badge-gold text-xs'
  return 'badge text-xs bg-red-500/10 text-red-400 border border-red-500/20'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [uploading, setUploading] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'saved', label: 'Saved Programs', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1500))
    setUploading(false)
    toast.success(`${file.name} uploaded successfully!`)
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-teal-500/30 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-white">
                  Welcome, {user?.user_metadata?.full_name || 'Valued Client'} 👋
                </h1>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Applications', value: '3', icon: FileText, color: 'from-indigo-500/20 to-purple-500/10' },
            { label: 'Documents Uploaded', value: '12', icon: Upload, color: 'from-teal-500/20 to-cyan-500/10' },
            { label: 'Saved Programs', value: '5', icon: Globe, color: 'from-gold-500/20 to-orange-500/10' },
            { label: 'Profile Complete', value: '78%', icon: User, color: 'from-pink-500/20 to-rose-500/10' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`glass rounded-xl p-4 bg-gradient-to-br ${s.color} relative overflow-hidden`}>
              <s.icon size={16} className="text-slate-400 mb-2" />
              <div className="text-2xl font-bold text-white font-display">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-navy-950'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-gold-400" /> Recent Applications
                </h3>
                <div className="space-y-3">
                  {mockApplications.map(app => (
                    <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="text-2xl">{app.country.split(' ')[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{app.type}</div>
                        <div className="text-xs text-slate-400">{app.country}</div>
                        <div className="progress-bar mt-2">
                          <div className="progress-fill" style={{ width: `${app.progress}%` }} />
                        </div>
                      </div>
                      <span className={statusBadge(app.status)}>{app.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Bell size={16} className="text-gold-400" /> Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { msg: 'Your Canada Express Entry application is under review', time: '2 hours ago', color: 'text-gold-400' },
                    { msg: 'Document verification complete for Work Experience Letter', time: '1 day ago', color: 'text-teal-400' },
                    { msg: 'New documents required for Germany Work Permit', time: '2 days ago', color: 'text-red-400' },
                    { msg: 'Profile completeness is 78%. Upload remaining documents', time: '3 days ago', color: 'text-slate-400' },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-current ${n.color}`} />
                      <div>
                        <p className="text-sm text-slate-300">{n.msg}</p>
                        <span className="text-xs text-slate-500">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Applications */}
          {activeTab === 'applications' && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <h3 className="text-white font-semibold">All Applications</h3>
                <button className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
                  <Plus size={14} /> New Application
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full glass-table">
                  <thead>
                    <tr>
                      <th className="text-left">Program</th>
                      <th className="text-left">Country</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Progress</th>
                      <th className="text-left">Date</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {mockApplications.map(app => (
                      <tr key={app.id}>
                        <td className="text-white font-medium">{app.type}</td>
                        <td>{app.country}</td>
                        <td><span className={statusBadge(app.status)}>{statusIcon(app.status)} {app.status}</span></td>
                        <td>
                          <div className="flex items-center gap-2 min-w-32">
                            <div className="progress-bar flex-1">
                              <div className="progress-fill" style={{ width: `${app.progress}%` }} />
                            </div>
                            <span className="text-xs text-slate-400">{app.progress}%</span>
                          </div>
                        </td>
                        <td className="text-slate-400">{app.date}</td>
                        <td>
                          <button className="text-gold-400 hover:text-gold-300 text-sm flex items-center gap-1">
                            View <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Upload area */}
              <div className="glass rounded-2xl p-8 border-2 border-dashed border-white/10 text-center hover:border-gold-500/30 transition-colors">
                <Upload size={32} className="text-slate-500 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Upload Documents</h3>
                <p className="text-slate-400 text-sm mb-4">PDF, JPG, PNG up to 10MB</p>
                <label className="btn-primary cursor-pointer inline-block">
                  {uploading ? 'Uploading...' : 'Choose Files'}
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </div>

              {/* Document list */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-white font-semibold">Uploaded Documents</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {mockDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FileText size={18} className="text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.size} • {doc.date}</div>
                      </div>
                      <span className={doc.status === 'Verified' ? 'badge badge-teal text-xs' : 'badge badge-gold text-xs'}>
                        {doc.status}
                      </span>
                      <button className="text-slate-400 hover:text-slate-200 p-1.5">
                        <Download size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Saved Programs */}
          {activeTab === 'saved' && (
            <div className="grid md:grid-cols-3 gap-4">
              {savedPrograms.map((prog, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{prog.flag}</div>
                    <span className="badge badge-purple text-xs">{prog.type}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-3">{prog.name}</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Points / Score</span>
                      <span className="text-white">{prog.points}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Next Draw</span>
                      <span className="text-white">{prog.deadline}</span>
                    </div>
                  </div>
                  <button className="btn-primary w-full text-sm mt-4 py-2">Apply Now</button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-6">Profile Information</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: user?.user_metadata?.full_name || '', placeholder: 'John Smith' },
                    { label: 'Email', value: user?.email || '', placeholder: 'john@email.com', disabled: true },
                    { label: 'Phone', value: '', placeholder: '+1 234 567 890' },
                    { label: 'Nationality', value: '', placeholder: 'Indian' },
                    { label: 'Current Country', value: '', placeholder: 'United Arab Emirates' },
                    { label: 'Desired Country', value: '', placeholder: 'Canada' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="label">{field.label}</label>
                      <input className="input-glass" defaultValue={field.value} placeholder={field.placeholder} disabled={field.disabled} />
                    </div>
                  ))}
                  <button className="btn-primary mt-2">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}