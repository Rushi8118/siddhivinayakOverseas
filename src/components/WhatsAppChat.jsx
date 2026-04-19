import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ChevronDown } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '919925064666'  // country code + number, no + or spaces
const AGENT_NAME = 'SiddhivinayakOverseas'
const AGENT_ROLE = 'Immigration Consultant'
const AGENT_AVATAR = null            // set to an image URL to use a photo

const GREETING_DELAY = 3000           // ms before popup auto-opens
const GREETING_MSG = "👋 Hi there! Welcome to SiddhivinayakOverseas.\n\nI'm here to help you with visa applications, work permits, study visas and immigration queries.\n\nHow can I assist you today?"

const QUICK_REPLIES = [
  'I want to apply for a Work Permit 🌍',
  'Tell me about Study Visa options 🎓',
  'How do I get Permanent Residency? 🏠',
  'Book a free consultation 📞',
]
// ─────────────────────────────────────────────────────────────────────────────

function buildWaLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [badge, setBadge] = useState(true)
  const inputRef = useRef(null)

  // Auto-open after delay (once per session)
  useEffect(() => {
    if (sessionStorage.getItem('wa_opened')) return
    const t = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem('wa_opened', '1')
    }, GREETING_DELAY)
    return () => clearTimeout(t)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setBadge(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const sendMessage = (msg) => {
    const text = (msg || input).trim()
    if (!text) return
    window.open(buildWaLink(text), '_blank', 'noopener,noreferrer')
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              key="label"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.5 }}
              className="glass-dark rounded-2xl px-4 py-2 text-sm text-white font-medium shadow-premium border border-white/10 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              💬 Chat with us
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open WhatsApp chat"
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/40 text-white"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={26} />
              </motion.div>
            ) : (
              <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <FaWhatsapp size={28} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification badge */}
          <AnimatePresence>
            {badge && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow"
              >
                1
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Chat Popup Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {AGENT_AVATAR
                      ? <img src={AGENT_AVATAR} alt={AGENT_NAME} className="w-full h-full rounded-full object-cover" />
                      : <FaWhatsapp size={22} />
                    }
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-green-600 rounded-full" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{AGENT_NAME}</p>
                  <p className="text-green-100 text-xs">{AGENT_ROLE} · Online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat body */}
            <div className="bg-[#0a1628] px-4 pt-5 pb-3">
              {/* Greeting bubble */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600/30 flex-shrink-0 flex items-center justify-center">
                  <FaWhatsapp size={14} className="text-green-400" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 leading-relaxed whitespace-pre-line"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {GREETING_MSG}
                </motion.div>
              </div>

              {/* Quick replies */}
              <div className="mb-4">
                <p className="text-slate-500 text-xs mb-2 ml-1">Quick options:</p>
                <div className="flex flex-col gap-2">
                  {QUICK_REPLIES.map((reply, i) => (
                    <motion.button
                      key={reply}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      onClick={() => sendMessage(reply)}
                      className="text-left text-sm px-4 py-2.5 rounded-xl text-green-300 border border-green-500/25 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-200 transition-all"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="bg-[#0a1628] border-t border-white/5 px-3 py-3 flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your message…"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-green-500/40 focus:bg-white/8 transition-all"
              />
              <motion.button
                onClick={() => sendMessage()}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
              >
                <Send size={16} />
              </motion.button>
            </div>

            {/* WhatsApp branding */}
            <div className="bg-[#0a1628] text-center pb-3 flex items-center justify-center gap-1.5">
              <FaWhatsapp size={13} className="text-green-500" />
              <span className="text-slate-600 text-[11px]">Powered by WhatsApp</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
