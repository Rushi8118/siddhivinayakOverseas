import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApplications, getProfile, updateProfile, getDocuments, uploadDocument, getVisaPrograms, supabase } from '../lib/supabaseClient'
import {
  User, FileText, Upload, Bell, CheckCircle, Clock, XCircle,
  Globe, TrendingUp, AlertCircle, ChevronRight, Plus, Download
} from 'lucide-react'
import toast from 'react-hot-toast'

const statusIcon = (status) => {
  const s = status?.toLowerCase()
  if (s === 'approved') return <CheckCircle size={14} className="text-teal-400" />
  if (s === 'pending' || s === 'in_review') return <Clock size={14} className="text-gold-400" />
  return <AlertCircle size={14} className="text-red-400" />
}

const statusBadge = (status) => {
  const s = status?.toLowerCase()
  if (s === 'approved') return 'badge badge-teal text-xs'
  if (s === 'pending' || s === 'in_review') return 'badge badge-gold text-xs'
  return 'badge text-xs bg-red-500/10 text-red-400 border border-red-500/20'
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [uploading, setUploading] = useState(false)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(true)
  const [documents, setDocuments] = useState([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [programs, setPrograms] = useState([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    nationality: '',
    currentCountry: '',
    desiredCountry: ''
  })

  useEffect(() => {
    if (user) {
      fetchApplications()
      fetchProfile()
      fetchDocuments()
      fetchPrograms()
    }
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  const fetchDocuments = async () => {
    try {
      const { data, error } = await getDocuments(user.id)
      if (error) throw error
      const docs = (data || [])
        .filter(d => d.name !== '.emptyFolderPlaceholder')
        .map(d => ({
          name: d.name.replace(/^\d+_/, ''), // Remove timestamp prefix if any
          rawName: d.name,
          size: d.metadata?.size ? (d.metadata.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown',
          date: new Date(d.created_at).toLocaleDateString(),
          status: 'Uploaded',
          path: `${user.id}/documents/${d.name}`
        }))
      setDocuments(docs)
    } catch (error) {
      console.error('Error fetching docs:', error)
    } finally {
      setLoadingDocs(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const { data, error } = await getVisaPrograms()
      if (error) throw error
      setPrograms(data || [])
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoadingPrograms(false)
    }
  }

  const profileFields = ['fullName', 'email', 'phone', 'nationality', 'currentCountry', 'desiredCountry']
  const filledFields = profileFields.filter(f => profileData[f] && profileData[f].trim() !== '').length
  const profileCompleteness = Math.round((filledFields / profileFields.length) * 100)
  const activeApplicationsCount = applications.filter((app) => ['pending', 'in_review'].includes(app.status)).length

  // Generate dynamic notifications
  useEffect(() => {
    const newNotifications = []
    if (applications.length > 0) {
      const latestApp = applications[0]
      newNotifications.push({
        msg: `Your ${latestApp.country} ${latestApp.service.split('-').join(' ')} application is ${latestApp.status}`,
        time: new Date(latestApp.updated_at || latestApp.created_at).toLocaleDateString(),
        color: latestApp.status === 'approved' ? 'text-teal-400' : latestApp.status === 'rejected' ? 'text-red-400' : 'text-gold-400'
      })
    }
    if (documents.length > 0) {
      newNotifications.push({
        msg: `Successfully uploaded ${documents[0].name}`,
        time: documents[0].date,
        color: 'text-teal-400'
      })
    }
    
    if (profileCompleteness < 100) {
      newNotifications.push({
        msg: `Profile completeness is ${profileCompleteness}%. Update your profile.`,
        time: 'Just now',
        color: 'text-slate-400'
      })
    }
    
    setNotifications(newNotifications)
  }, [applications, documents, profileCompleteness])

  const fetchApplications = async () => {
    try {
      const { data, error } = await getApplications(user.id)
      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoadingApps(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const { data, error } = await getProfile(user.id)
      if (error) throw error
      if (data) {
        setProfileData({
          fullName: data.full_name || user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp_number || '',
          nationality: data.nationality || '',
          currentCountry: data.current_country || '',
          desiredCountry: data.desired_country || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      const { error } = await updateProfile(user.id, {
        full_name: profileData.fullName,
        phone: profileData.phone,
        whatsapp_number: profileData.whatsapp,
        nationality: profileData.nationality,
        current_country: profileData.currentCountry,
        desired_country: profileData.desiredCountry
      })
      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'saved', label: 'Available Programs', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { error } = await uploadDocument(user.id, file)
      if (error) throw error
      toast.success(`${file.name} uploaded successfully!`)
      fetchDocuments() // refresh list
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload document')
    } finally {
      setUploading(false)
      e.target.value = '' // reset input
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-slate-400">{loading ? 'Loading dashboard...' : 'Redirecting to login...'}</div>
      </div>
    )
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
            { label: 'Active Applications', value: activeApplicationsCount.toString(), icon: FileText, color: 'from-indigo-500/20 to-purple-500/10' },
            { label: 'Documents Uploaded', value: documents.length.toString(), icon: Upload, color: 'from-teal-500/20 to-cyan-500/10' },
            { label: 'Available Programs', value: programs.length.toString(), icon: Globe, color: 'from-gold-500/20 to-orange-500/10' },
            { label: 'Profile Complete', value: `${profileCompleteness}%`, icon: User, color: 'from-pink-500/20 to-rose-500/10' },
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
                  {loadingApps ? (
                    <div className="text-slate-500 text-sm">Loading applications...</div>
                  ) : applications.length === 0 ? (
                    <div className="text-slate-500 text-sm">No applications found.</div>
                  ) : (
                    applications.slice(0, 3).map(app => (
                      <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="text-2xl">{app.country === 'Canada' ? '🇨🇦' : app.country === 'Australia' ? '🇦🇺' : app.country === 'Germany' ? '🇩🇪' : '🌍'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white">{app.service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                          <div className="text-xs text-slate-400">{app.country}</div>
                        </div>
                        <span className={statusBadge(app.status)}>{app.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Bell size={16} className="text-gold-400" /> Notifications
                </h3>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-slate-500 text-sm">No new notifications</div>
                  ) : (
                    notifications.slice(0, 4).map((n, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-current ${n.color}`} />
                        <div>
                          <p className="text-sm text-slate-300">{n.msg}</p>
                          <span className="text-xs text-slate-500">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applications */}
          {activeTab === 'applications' && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <h3 className="text-white font-semibold">All Applications</h3>
                <Link to="/apply" className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
                  <Plus size={14} /> New Application
                </Link>
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
                    {loadingApps ? (
                      <tr><td colSpan="6" className="text-center py-4 text-slate-500">Loading applications...</td></tr>
                    ) : applications.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-4 text-slate-500">No applications found.</td></tr>
                    ) : (
                      applications.map(app => (
                        <tr key={app.id}>
                          <td className="text-white font-medium">{app.service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</td>
                          <td>{app.country}</td>
                          <td><span className={statusBadge(app.status)}>{statusIcon(app.status)} {app.status}</span></td>
                          <td>
                            <div className="flex items-center gap-2 min-w-32">
                              <div className="progress-bar flex-1">
                                <div className="progress-fill" style={{ width: app.status === 'approved' ? '100%' : app.status === 'rejected' ? '100%' : '50%' }} />
                              </div>
                              <span className="text-xs text-slate-400">{app.status === 'approved' ? '100%' : app.status === 'rejected' ? '100%' : '50%'}</span>
                            </div>
                          </td>
                          <td className="text-slate-400">{new Date(app.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => setSelectedApplication(app)}
                              className="text-gold-400 hover:text-gold-300 text-sm flex items-center gap-1"
                            >
                              View <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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
                  {loadingDocs ? (
                    <div className="p-4 text-center text-slate-500">Loading documents...</div>
                  ) : documents.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">No documents uploaded yet.</div>
                  ) : documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FileText size={18} className="text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.size} • {doc.date}</div>
                      </div>
                      <span className="badge badge-teal text-xs">
                        {doc.status}
                      </span>
                      <button 
                        onClick={async () => {
                          const { data, error } = await supabase.storage.from('user-documents').createSignedUrl(doc.path, 60)
                          if (data) window.open(data.signedUrl, '_blank')
                          else toast.error('Could not download file')
                        }}
                        className="text-slate-400 hover:text-slate-200 p-1.5"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Available Programs */}
          {activeTab === 'saved' && (
            <div className="grid md:grid-cols-3 gap-4">
              {loadingPrograms ? (
                <div className="col-span-3 text-center py-8 text-slate-500">Loading programs...</div>
              ) : programs.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-slate-500">No programs available at the moment.</div>
              ) : (
                programs.map((prog, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-5 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">
                        {prog.country === 'Canada' ? '🇨🇦' : prog.country === 'Australia' ? '🇦🇺' : prog.country === 'Germany' ? '🇩🇪' : prog.country === 'UK' ? '🇬🇧' : '🌍'}
                      </div>
                      <span className="badge badge-purple text-xs">{prog.visa_type}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-3 flex-1">{prog.name}</h3>
                    <div className="space-y-1.5 text-sm mb-4">
                      <div className="flex justify-between text-slate-400">
                        <span>Processing</span>
                        <span className="text-white">{prog.processing_time || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Country</span>
                        <span className="text-white">{prog.country}</span>
                      </div>
                    </div>
                    <Link to="/apply" className="btn-primary w-full text-sm py-2 text-center block">Apply Now</Link>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-6">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {[
                    { label: 'Full Name', value: profileData.fullName, name: 'fullName', placeholder: 'John Smith' },
                    { label: 'Email Address', value: profileData.email, name: 'email', placeholder: 'john@email.com', disabled: true },
                    { label: 'WhatsApp Number', value: profileData.whatsapp || '', name: 'whatsapp', placeholder: '+91 99250 64666' },
                    { label: 'Phone Number', value: profileData.phone, name: 'phone', placeholder: '+91 234 567 890' },
                    { label: 'Nationality', value: profileData.nationality, name: 'nationality', placeholder: 'Indian' },
                    { label: 'Current Country', value: profileData.currentCountry, name: 'currentCountry', placeholder: 'United Arab Emirates' },
                    { label: 'Desired Country', value: profileData.desiredCountry, name: 'desiredCountry', placeholder: 'Canada' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="label">{field.label}</label>
                      <input 
                        className="input-glass" 
                        value={field.value} 
                        name={field.name}
                        onChange={(e) => setProfileData({ ...profileData, [field.name]: e.target.value })}
                        placeholder={field.placeholder} 
                        disabled={field.disabled} 
                      />
                    </div>
                  ))}
                  <button type="submit" className="btn-primary mt-2">Save Changes</button>
                </form>
              </div>
            </div>
          )}
        </motion.div>

        {selectedApplication && (
          <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="glass-premium rounded-2xl p-6 max-w-lg w-full border border-white/10">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Application Details</h3>
                  <p className="text-sm text-slate-400">{selectedApplication.full_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Service</span>
                  <span className="text-white text-right">{selectedApplication.service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Country</span>
                  <span className="text-white text-right">{selectedApplication.country}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Status</span>
                  <span className="text-white text-right capitalize">{selectedApplication.status.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Email</span>
                  <span className="text-white text-right">{selectedApplication.email}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-white text-right">{selectedApplication.phone}</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="text-slate-500 mb-2">Message</div>
                  <p className="text-slate-300 leading-relaxed">{selectedApplication.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
