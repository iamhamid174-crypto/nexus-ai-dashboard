import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function ErrorPage({ code = 404, title = 'Page Not Found', message = "The page you're looking for doesn't exist or has been moved." }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-light dark:bg-mesh-dark bg-surface-50 dark:bg-surface-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Error Code */}
        <div className="relative mb-6">
          <span className="text-[120px] sm:text-[160px] font-display font-bold gradient-text leading-none select-none">
            {code}
          </span>
          <div className="absolute inset-0 bg-gradient-brand opacity-10 blur-3xl rounded-full" />
        </div>

        <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-100 mb-3">{title}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mb-8 leading-relaxed">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-outline">
            <FiArrowLeft size={15} />
            Go Back
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-brand">
            <FiHome size={15} />
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}
