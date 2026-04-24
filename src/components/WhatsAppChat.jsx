import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ChevronDown, Check, CheckCheck } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '919925064666'
const AGENT_NAME      = 'Siddhivinayak Overseas'
const AGENT_ROLE      = 'Study Abroad Assistant'
const BRAND_GREEN     = '#128C7E'

const GREETING_DELAY  = 3500
const GREETING_MSG    = "Hi! I'm the Siddhivinayak Overseas virtual assistant.\n\nI can instantly answer your questions about studying in the UK, Germany and France — fees, visas, IELTS, scholarships, intakes and more.\n\nWhat would you like to know?"

const QUICK_REPLIES = [
  'Study in UK',
  'Study in Germany',
  'Study in France',
  'What are the fees?',
  'Tell me about visas',
  'Book a free consultation',
]

function buildWaLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// ─── KNOWLEDGE BASE / INTENT ENGINE ──────────────────────────────────────────
// Each intent has trigger keywords (with weights) and a reply. The engine
// tokenises user input, scores every intent, and returns the best match.
const INTENTS = [
  {
    id: 'greeting',
    triggers: [
      { words: ['hi', 'hello', 'hey', 'hola', 'namaste', 'good morning', 'good evening', 'good afternoon'], weight: 3 },
    ],
    reply: "Hello! Great to have you here. Are you exploring study options in the UK, Germany or France? I can walk you through courses, fees and visas right away.",
  },
  {
    id: 'uk',
    triggers: [
      { words: ['uk', 'u.k', 'britain', 'england', 'london', 'manchester', 'edinburgh', 'scotland'], weight: 4 },
    ],
    reply: "UK is our most popular destination. Highlights:\n\n• 1-year Master's (saves time & money)\n• 2-year Graduate Route post-study work visa\n• Partner universities: Coventry, Hertfordshire, Greenwich, Leicester, Birmingham City\n• Intakes: September & January\n• Tuition: ~£12,000–£20,000/yr\n\nWant me to shortlist universities based on your profile?",
  },
  {
    id: 'germany',
    triggers: [
      { words: ['germany', 'deutschland', 'german', 'berlin', 'munich', 'hamburg', 'frankfurt'], weight: 4 },
    ],
    reply: "Germany is excellent for STEM and public universities charge little to no tuition.\n\n• Public unis: €0–€500/semester\n• Private unis: €10k–€20k/yr\n• 18-month post-study job-seeker visa\n• Strong demand in IT, Engineering, Data Science\n• German language help (A1–B1) included\n\nShall I check your eligibility for public universities?",
  },
  {
    id: 'france',
    triggers: [
      { words: ['france', 'french', 'paris', 'lyon', 'nice', 'bordeaux'], weight: 4 },
    ],
    reply: "France combines world-class education with an affordable cost of living.\n\n• Public unis: €2,770–€3,770/yr (non-EU)\n• Business schools: €12k–€25k/yr\n• 2-year post-study work permit (APS)\n• Intakes: September & February\n• English-taught programs available\n\nWould you like recommendations for business schools or public universities?",
  },
  {
    id: 'fees',
    triggers: [
      { words: ['fee', 'fees', 'cost', 'tuition', 'price', 'budget', 'expense', 'expensive', 'cheap', 'affordable', 'how much'], weight: 3 },
    ],
    reply: "Here's a quick cost overview (tuition/year):\n\n• UK: £12,000–£20,000\n• Germany (public): €0–€500/semester\n• Germany (private): €10,000–€20,000\n• France (public): €2,770–€3,770\n• France (private): €12,000–€25,000\n\nLiving costs: £9k–£12k (UK), €10k–€12k (Germany/France).\n\nWhich country should I detail further?",
  },
  {
    id: 'scholarship',
    triggers: [
      { words: ['scholarship', 'scholar', 'funding', 'fund', 'aid', 'grant', 'bursary', 'discount', 'waiver'], weight: 3 },
    ],
    reply: "Yes — we help students secure scholarships every intake:\n\n• UK: Chevening, GREAT, university merit awards (£2k–£6k)\n• Germany: DAAD, Deutschlandstipendium\n• France: Eiffel, Campus France, Ile-de-France grants\n\nOur counsellors tailor applications to your profile. Want a free scholarship eligibility check?",
  },
  {
    id: 'ielts',
    triggers: [
      { words: ['ielts', 'toefl', 'pte', 'english', 'language', 'language test', 'english test', 'duolingo'], weight: 3 },
    ],
    reply: "English requirements (most common):\n\n• UK: IELTS 6.0–6.5 overall, 5.5–6.0 in each band\n• Germany (English programs): IELTS 6.0–6.5 or TOEFL 80+\n• France: IELTS 6.0–6.5 for English-taught programs\n\nNo IELTS? Many of our UK partner universities accept MOI (Medium of Instruction) letters + internal tests. Shall I check no-IELTS options for you?",
  },
  {
    id: 'visa',
    triggers: [
      { words: ['visa', 'student visa', 'study visa', 'refusal', 'rejected', 'ukvi', 'embassy', 'tier 4', 'tier4'], weight: 4 },
    ],
    reply: "Our visa success rate is 98%. We handle the entire process:\n\n• CAS / Zulassung / Campus France application\n• Financial documents & bank statement prep\n• SOP & credibility interview coaching\n• Tuberculosis test, biometrics, VFS slot booking\n• Visa fee: UK £524, Germany €75, France €99\n\nHave a previous refusal? We specialise in reapplications too. Want to discuss your case?",
  },
  {
    id: 'process',
    triggers: [
      { words: ['process', 'how long', 'timeline', 'duration', 'steps', 'procedure', 'when', 'start', 'how do i'], weight: 2 },
    ],
    reply: "Our 5-step process:\n\n1. Free profile assessment & country shortlisting\n2. University applications (3–7 days)\n3. Offer letter & deposit (2–6 weeks)\n4. Visa filing with full documentation\n5. Pre-departure: flights, accommodation, SIM, forex\n\nTypical end-to-end timeline: 3–5 months. Want to start your assessment today?",
  },
  {
    id: 'intake',
    triggers: [
      { words: ['intake', 'september', 'january', 'february', 'fall', 'spring', 'summer', 'next batch', 'winter'], weight: 3 },
    ],
    reply: "Upcoming intakes:\n\n• UK: September 2026 (apply by Jun) | January 2027 (apply by Oct)\n• Germany: Winter Sep 2026 (apply by Jul) | Summer Apr 2027 (apply by Jan)\n• France: Sept 2026 (apply by May) | Feb 2027 (apply by Nov)\n\nStart 4–6 months early for best scholarships and accommodation. Which intake are you targeting?",
  },
  {
    id: 'documents',
    triggers: [
      { words: ['document', 'documents', 'requirement', 'requirements', 'need', 'sop', 'lor', 'transcript', 'checklist', 'paperwork'], weight: 3 },
    ],
    reply: "Standard document checklist:\n\n• 10th, 12th, Bachelor's marksheets & certificates\n• Passport (valid 6+ months)\n• IELTS / TOEFL / PTE scorecard\n• SOP + 2 LORs + CV\n• Work experience letters (if any)\n• Financial proof (FD / loan letter / bank statement)\n• Passport-size photos\n\nWe draft your SOP and LORs for you. Shall I email you the full checklist?",
  },
  {
    id: 'jobs',
    triggers: [
      { words: ['job', 'work', 'part time', 'part-time', 'after study', 'pr', 'settle', 'permanent', 'post study', 'career'], weight: 3 },
    ],
    reply: "Work & post-study options:\n\n• UK: 20 hrs/week during study + 2-year Graduate Route visa after\n• Germany: 120 full days/year + 18-month job-seeker visa; PR in 2 yrs with Blue Card\n• France: 20 hrs/week + 2-year APS permit after Master's\n\nWe also run a job-assistance program post-graduation. Interested?",
  },
  {
    id: 'consultation',
    triggers: [
      { words: ['book', 'consultation', 'consult', 'appointment', 'meeting', 'meet', 'free', 'counsellor', 'counselor', 'talk to counselor', 'talk to counsellor'], weight: 4 },
    ],
    reply: "Happy to book you in. Our free 30-minute consultation covers:\n\n• Profile evaluation\n• Country & university shortlist\n• Scholarship eligibility\n• Budget & timeline roadmap\n\nTap \"Talk to a human on WhatsApp\" below and share your name, preferred country and degree level — a counsellor will confirm your slot within 15 minutes.",
  },
  {
    id: 'contact',
    triggers: [
      { words: ['contact', 'phone', 'mobile', 'call', 'email', 'address', 'office', 'location', 'reach', 'where are you'], weight: 3 },
    ],
    reply: "You can reach us anytime:\n\n• WhatsApp / Call: +91 99250 64666\n• Email: info@siddhivinayakoverseas.com\n• Office: Ahmedabad, Gujarat, India\n• Hours: Mon–Sat, 10 AM – 7 PM IST\n\nPrefer WhatsApp? Tap the button below to chat with a counsellor.",
  },
  {
    id: 'services',
    triggers: [
      { words: ['service', 'services', 'offer', 'do you', 'help me', 'what can you', 'what do you'], weight: 2 },
    ],
    reply: "We offer end-to-end overseas education services:\n\n• University shortlisting & application\n• SOP, LOR & CV drafting\n• Visa documentation & interview prep\n• IELTS / PTE coaching\n• Loan, forex & bank statement guidance\n• Pre-departure & accommodation support\n• Post-landing job assistance\n\nWhich service matters most to you?",
  },
  {
    id: 'human',
    triggers: [
      { words: ['human', 'real person', 'agent', 'representative', 'call me', 'speak to', 'talk to someone', 'connect me'], weight: 4 },
    ],
    reply: "Of course. Please tap \"Talk to a human on WhatsApp\" below and drop your name + preferred country — a senior counsellor will reply within 15 minutes during business hours.",
  },
  {
    id: 'thanks',
    triggers: [
      { words: ['thank', 'thanks', 'thx', 'appreciate', 'great help', 'helpful'], weight: 3 },
    ],
    reply: "You're most welcome! Is there anything else about the UK, Germany or France I can help with?",
  },
  {
    id: 'age_eligibility',
    triggers: [
      { words: ['eligible', 'eligibility', 'qualify', 'can i', 'age', 'gap', 'backlog', 'low score', 'low percentage'], weight: 3 },
    ],
    reply: "Eligibility varies, but here are the usual thresholds:\n\n• UK: 55–60% in Bachelor's; gaps up to 2 yrs; backlogs up to 15 accepted by many unis\n• Germany: 70%+ and 180 ECTS equivalent for Master's\n• France: 60%+ generally; gaps accepted with explanation\n\nShare your academic details and I'll tell you exactly which universities match you.",
  },
  {
    id: 'accommodation',
    triggers: [
      { words: ['accommodation', 'housing', 'stay', 'hostel', 'dorm', 'rent', 'apartment', 'flat'], weight: 3 },
    ],
    reply: "We help you secure accommodation before you fly:\n\n• UK: University halls £500–£900/month or private student housing (Unite, iQ)\n• Germany: Studentenwerk dorms €250–€450/month; WG shared flats\n• France: CROUS dorms €200–€400/month; CAF housing aid available\n\nWe book for you free of charge. Want me to share options?",
  },
  {
    id: 'loan',
    triggers: [
      { words: ['loan', 'education loan', 'finance', 'bank', 'collateral', 'hdfc', 'sbi', 'icici', 'avanse', 'prodigy'], weight: 3 },
    ],
    reply: "We partner with leading education loan providers:\n\n• Secured: SBI, BoB, PNB (up to ₹1.5 Cr, 8.5–10% interest)\n• Unsecured: HDFC Credila, Avanse, Auxilo (up to ₹60L, 10.5–12.5%)\n• Abroad lenders: Prodigy, MPower (no collateral, USD)\n\nOur finance desk helps with sanction letters & bank statement formatting. Want a loan pre-check?",
  },
]

const FALLBACK_REPLY = "I didn't quite catch that. I can help with:\n\n• Study in UK / Germany / France\n• Fees & scholarships\n• Visa & IELTS requirements\n• Intakes & application process\n• Booking a free consultation\n\nTry one of the quick options below, or ask me directly."

// Tokenise + score
function pickIntent(text) {
  const t = ` ${text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()} `
  if (!t.trim()) return null

  let best = { intent: null, score: 0 }
  for (const intent of INTENTS) {
    let score = 0
    for (const trig of intent.triggers) {
      for (const w of trig.words) {
        if (t.includes(` ${w} `) || t.startsWith(`${w} `) || t.endsWith(` ${w}`) || t.trim() === w) {
          score += trig.weight
        }
      }
    }
    if (score > best.score) best = { intent, score }
  }
  return best.score >= 2 ? best.intent : null
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function WhatsAppChat() {
  const [open, setOpen]         = useState(false)
  const [input, setInput]       = useState('')
  const [badge, setBadge]       = useState(true)
  const [messages, setMessages] = useState([])
  const [typing, setTyping]     = useState(false)

  const inputRef  = useRef(null)
  const scrollRef = useRef(null)

  const currentTime = useMemo(() => {
    const d = new Date()
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [messages.length])

  // Seed greeting when chat first opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setTyping(true)
      const t = setTimeout(() => {
        setMessages([{ id: Date.now(), role: 'bot', text: GREETING_MSG, quick: true, time: currentTime }])
        setTyping(false)
      }, 700)
      return () => clearTimeout(t)
    }
  }, [open, messages.length, currentTime])

  // Auto-open after delay
  useEffect(() => {
    if (sessionStorage.getItem('wa_opened')) return
    const t = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem('wa_opened', '1')
    }, GREETING_DELAY)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) {
      setBadge(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const pushUser = (text) => {
    setMessages(m => [...m, { id: Date.now(), role: 'user', text, time: now() }])
  }

  const pushBot = (text, quick = false) => {
    setMessages(m => [...m, { id: Date.now() + Math.random(), role: 'bot', text, quick, time: now() }])
  }

  const respond = (userText) => {
    const intent = pickIntent(userText)
    const delay  = 700 + Math.min(1800, userText.length * 25)
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      if (intent) {
        pushBot(intent.reply)
      } else {
        pushBot(FALLBACK_REPLY, true)
      }
    }, delay)
  }

  const handleSend = (msg) => {
    const text = (msg ?? input).trim()
    if (!text) return
    pushUser(text)
    setInput('')
    respond(text)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const openWhatsApp = () => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    const context  = lastUser ? `Hi, I was chatting on your website. My question: "${lastUser.text}"` : 'Hi, I was chatting on your website and would like to speak with a counsellor.'
    window.open(buildWaLink(context), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* ── Floating Trigger ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              key="label"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.5 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-2 text-sm text-navy-900 font-medium shadow-premium border border-gold-300/50 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              Chat with our assistant
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open chat"
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

          <AnimatePresence>
            {badge && !open && (
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

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[400px] rounded-3xl overflow-hidden border border-white/90 flex flex-col"
            style={{
              maxHeight: 'min(640px, calc(100vh - 120px))',
              boxShadow: '0 25px 60px rgba(15, 42, 68, 0.25), 0 0 0 1px rgba(255,255,255,0.4)',
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BRAND_GREEN} 0%, #25D366 100%)` }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    <FaWhatsapp size={22} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-[#128C7E] rounded-full" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{AGENT_NAME}</p>
                  <p className="text-green-50 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    {AGENT_ROLE} · Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{
                background: `
                  linear-gradient(rgba(230, 240, 235, 0.92), rgba(230, 240, 235, 0.92)),
                  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='%23128C7E' fill-opacity='0.08'><circle cx='30' cy='30' r='1.5'/><circle cx='10' cy='10' r='1'/><circle cx='50' cy='50' r='1'/></g></svg>")
                `,
              }}
            >
              {messages.map((m, idx) => (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  showQuick={m.quick && idx === messages.length - 1 && !typing}
                  onQuickPick={handleSend}
                />
              ))}

              {typing && <TypingIndicator />}
            </div>

            {/* Human handoff button */}
            <div className="flex-shrink-0 bg-white border-t border-sky-200/70 px-3 pt-2">
              <button
                onClick={openWhatsApp}
                className="w-full text-xs text-[#128C7E] hover:text-green-700 font-semibold py-1.5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <FaWhatsapp size={13} />
                Talk to a human on WhatsApp
              </button>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-sky-200/70 px-3 py-3 flex items-center gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your message..."
                className="flex-1 bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-700/40 outline-none focus:border-green-500/50 focus:bg-white transition-all"
                aria-label="Message"
              />
              <motion.button
                onClick={() => handleSend()}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}, #25D366)` }}
              >
                <Send size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function MessageBubble({ msg, showQuick, onQuickPick }) {
  const isUser = msg.role === 'user'
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className={`flex mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`relative max-w-[80%] px-3 py-2 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
            isUser
              ? 'bg-[#DCF8C6] text-navy-900 rounded-2xl rounded-tr-sm'
              : 'bg-white text-navy-900 rounded-2xl rounded-tl-sm'
          }`}
        >
          {msg.text}
          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isUser ? 'text-green-800/60' : 'text-navy-700/50'}`}>
            <span>{msg.time}</span>
            {isUser && <CheckCheck size={12} className="text-sky-500" />}
            {!isUser && <Check size={12} />}
          </div>
        </div>
      </motion.div>

      {showQuick && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 ml-2 mb-3 mt-1"
        >
          {QUICK_REPLIES.map((reply, i) => (
            <motion.button
              key={reply}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => onQuickPick(reply)}
              className="text-xs px-3 py-1.5 rounded-full text-[#128C7E] bg-white border border-[#128C7E]/40 hover:bg-[#128C7E] hover:text-white transition-all font-medium shadow-sm"
            >
              {reply}
            </motion.button>
          ))}
        </motion.div>
      )}
    </>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-start mb-2"
    >
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-navy-700/60"
          />
        ))}
      </div>
    </motion.div>
  )
}
