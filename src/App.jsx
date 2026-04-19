import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppChat from './components/WhatsAppChat'
import { AlertTriangle } from 'lucide-react'
import { supabase } from './lib/supabaseClient'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import WorkPermitPage from './pages/WorkPermitPage'
import StudyVisaPage from './pages/StudyVisaPage'
import JobAssistancePage from './pages/JobAssistancePage'
import CountryPage from './pages/CountryPage'
import ProgramPage from './pages/ProgramPage'
import ApplicationPage from './pages/ApplicationPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import SitemapPage from './pages/SitemapPage'
import ReviewsPage from './pages/ReviewsPage'

function SupabaseWarning() {
  if (supabase) return null
  return (
    <div className="bg-red-500/10 border-b border-red-500/20 py-2 px-4 flex items-center justify-center gap-3 text-red-400 text-xs font-medium">
      <AlertTriangle size={14} />
      <span>Supabase is not configured correctly. Authentication and database features will not work. Check your .env file.</span>
    </div>
  )
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

// Scrolls to top instantly on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppContent() {
  const location = useLocation()
  const noLayoutPages = ['/login', '/signup', '/forgot-password', '/reset-password']
  const showLayout = !noLayoutPages.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <SupabaseWarning />
      {showLayout && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
            <Route path="/reset-password" element={<PageWrapper><ResetPasswordPage /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
            <Route path="/services/work-permit" element={<PageWrapper><WorkPermitPage /></PageWrapper>} />
            <Route path="/services/study-visa" element={<PageWrapper><StudyVisaPage /></PageWrapper>} />
            <Route path="/services/job-assistance" element={<PageWrapper><JobAssistancePage /></PageWrapper>} />
            <Route path="/countries/:country" element={<PageWrapper><CountryPage /></PageWrapper>} />
            <Route path="/programs" element={<PageWrapper><ProgramPage /></PageWrapper>} />
            <Route path="/apply" element={<PageWrapper><ApplicationPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            <Route path="/reviews" element={<PageWrapper><ReviewsPage /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><PrivacyPolicyPage /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><TermsOfServicePage /></PageWrapper>} />
            <Route path="/cookies" element={<PageWrapper><CookiePolicyPage /></PageWrapper>} />
            <Route path="/sitemap" element={<PageWrapper><SitemapPage /></PageWrapper>} />
            <Route path="*" element={
              <PageWrapper>
                <div className="min-h-screen bg-navy-950 flex items-center justify-center text-center px-4">
                  <div>
                    <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
                    <h2 className="text-white text-2xl font-bold mb-2">Page Not Found</h2>
                    <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/"><button className="btn-primary">Back to Home</button></a>
                  </div>
                </div>
              </PageWrapper>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      {showLayout && <Footer />}
      {showLayout && <WhatsAppChat />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1b4b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#14b8a6', secondary: '#07061a' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#07061a' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  )
}
