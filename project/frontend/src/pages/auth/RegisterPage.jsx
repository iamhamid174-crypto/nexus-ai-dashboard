import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useAppDispatch, useToast } from '../../hooks'
import { registerUser, setCredentials } from '../../store/slices/authSlice'
import { InlineLoader } from '../../components/common/Loader'
import { MOCK_USER } from '../../utils/mockData'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Missing fields', 'Please fill in all required fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Password mismatch', 'Passwords do not match.')
      return
    }
    if (!agreed) {
      toast.error('Terms required', 'Please accept the terms of service.')
      return
    }
    setLoading(true)
    try {
      await dispatch(registerUser(form)).unwrap()
      toast.success('Account created!', 'Welcome to AI SAAS Dashboard.')
    } catch {
      // Demo mode
      const demoUser = { ...MOCK_USER, name: form.name, email: form.email }
      dispatch(setCredentials({ user: demoUser, token: 'demo-token-001' }))
      localStorage.setItem('saas_token', 'demo-token-001')
      localStorage.setItem('saas_user', JSON.stringify(demoUser))
      toast.success('Welcome to AI SAAS Dashboard!', 'Account created in demo mode.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-surface-100 mb-2">Create account</h1>
        <p className="text-surface-400 text-sm">Create an account to explore the dashboard in demo mode.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name"
              className="input-field pl-10 bg-surface-800/60 border-surface-700 text-surface-100 placeholder-surface-600" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Email</label>
          <div className="relative">
            <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com"
              className="input-field pl-10 bg-surface-800/60 border-surface-700 text-surface-100 placeholder-surface-600" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters"
              className="input-field pl-10 pr-10 bg-surface-800/60 border-surface-700 text-surface-100 placeholder-surface-600" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300">
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Confirm Password</label>
          <div className="relative">
            <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password"
              className="input-field pl-10 bg-surface-800/60 border-surface-700 text-surface-100 placeholder-surface-600" />
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <div className="relative mt-0.5">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
            <div className={`w-4 h-4 rounded border transition-all ${agreed ? 'bg-brand-500 border-brand-500' : 'border-surface-600 bg-surface-800'}`}>
              {agreed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>}
            </div>
          </div>
          <span className="text-xs text-surface-400">
            I agree to the{' '}
            <a href="#" className="text-brand-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-brand-400 hover:underline">Privacy Policy</a>
          </span>
        </label>

        <button type="submit" disabled={loading}
          className="w-full btn-brand justify-center py-3 text-base">
          {loading ? <InlineLoader size="sm" /> : <><span>Create account</span><FiArrowRight size={16} /></>}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
      </p>
    </motion.div>
  )
}
