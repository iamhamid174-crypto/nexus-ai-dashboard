import { Outlet, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks'
import { FiZap } from 'react-icons/fi'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen flex bg-surface-950 overflow-hidden">
      {/* Left panel - illustration */}
      <div className="hidden lg:flex flex-col w-1/2 relative bg-gradient-brand overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-500/30 rounded-full blur-3xl animate-float" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FiZap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">SAAS Dashboard</span>
          </div>

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4">
                The intelligent dashboard for modern teams
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Harness the power of AI to automate content, code, emails, and more — all in one unified workspace.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mt-12"
            >
              {[
                { label: 'Active Users', value: '24K+' },
                { label: 'AI Requests/Mo', value: '1.2M+' },
                { label: 'Teams', value: '2,800+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-white/60 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur rounded-2xl p-5"
          >
            <p className="text-white/80 text-sm italic leading-relaxed">
              "SAAS Dashboard helps our team stay on top of projects, billing, and weekly activity without switching tools."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold text-white">SR</div>
              <div>
                <p className="text-white text-xs font-semibold">Sarah Rodriguez</p>
                <p className="text-white/50 text-[11px]">Head of Marketing, TechCorp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
              <FiZap size={17} className="text-white" />
            </div>
            <span className="font-display font-bold text-surface-100 text-lg">SAAS <span className="gradient-text">Dashboard</span></span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
