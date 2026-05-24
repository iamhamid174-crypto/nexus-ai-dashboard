import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useAppDispatch, useToast } from '../../hooks'
import { loginUser, setCredentials } from '../../store/slices/authSlice'
import { InlineLoader } from '../../components/common/Loader'
import { MOCK_USER } from '../../utils/mockData'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Missing fields', 'Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await dispatch(loginUser(form)).unwrap()
      toast.success('Welcome back!', 'You have successfully logged in.')
    } catch (err) {
      // Demo mode: accept any credentials
      dispatch(setCredentials({ user: MOCK_USER, token: 'demo-token-001' }))
      localStorage.setItem('saas_token', 'demo-token-001')
      localStorage.setItem('saas_user', JSON.stringify(MOCK_USER))
      toast.success('Welcome back!', 'Logged in using demo mode.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    dispatch(setCredentials({ user: MOCK_USER, token: 'demo-token-001' }))
    localStorage.setItem('saas_token', 'demo-token-001')
    localStorage.setItem('saas_user', JSON.stringify(MOCK_USER))
    toast.success('Demo mode!', 'Exploring SAAS Dashboard with sample data.')
  }

  const fields = [
    { name: 'email', label: 'Email address', type: 'email', icon: FiMail, placeholder: 'you@company.com' },
    { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password', icon: FiLock, placeholder: '••••••••' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-surface-100 mb-2">Sign in</h1>
        <p className="text-surface-400 text-sm">Welcome back — let's get you in.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
              {field.label}
            </label>
            <div className="relative">
              <field.icon
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500"
              />
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="input-field pl-10 bg-surface-800/60 border-surface-700 text-surface-100 placeholder-surface-600 focus:border-brand-500"
              />
              {field.name === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-brand justify-center py-3 text-base"
        >
          {loading ? (
            <InlineLoader size="sm" />
          ) : (
            <>Sign in <FiArrowRight size={16} /></>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-surface-700" />
        <span className="text-xs text-surface-500">or</span>
        <div className="flex-1 h-px bg-surface-700" />
      </div>

      {/* Demo button */}
      <button
        onClick={handleDemoLogin}
        className="w-full btn-outline border-surface-700 text-surface-400 hover:text-surface-200 hover:border-surface-500 justify-center py-2.5"
      >
        Try Demo (No account needed)
      </button>

      <p className="text-center text-sm text-surface-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </motion.div>
  )
}
