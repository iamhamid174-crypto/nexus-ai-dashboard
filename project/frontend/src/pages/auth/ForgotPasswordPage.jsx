import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { useToast } from '../../hooks'
import { InlineLoader } from '../../components/common/Loader'
import api from '../../services/api'

export default function ForgotPasswordPage() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Required', 'Please enter your email.'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
    } catch {
      // Demo: simulate success
    } finally {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-surface-100 mb-2">Reset password</h1>
              <p className="text-surface-400 text-sm">Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Email address</label>
                <div className="relative">
                  <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="input-field pl-10 bg-surface-800/60 border-surface-700 text-surface-100 placeholder-surface-600"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-brand justify-center py-3">
                {loading ? <InlineLoader size="sm" /> : <><span>Send reset link</span><FiArrowRight size={16} /></>}
              </button>
            </form>

            <Link to="/login" className="flex items-center justify-center gap-1.5 mt-6 text-sm text-surface-500 hover:text-surface-300 transition-colors">
              <FiArrowLeft size={14} /> Back to sign in
            </Link>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle size={28} className="text-success-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-surface-100 mb-2">Check your inbox</h2>
            <p className="text-surface-400 text-sm mb-8">
              We sent a password reset link to <strong className="text-surface-200">{email}</strong>
            </p>
            <Link to="/login" className="btn-brand">
              <FiArrowLeft size={15} /> Back to sign in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
