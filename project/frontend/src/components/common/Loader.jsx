import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-surface-950">
      <div className="flex flex-col items-center gap-6">
        {/* Logo mark animation */}
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-brand opacity-20 blur-xl" />
          <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/30" />
          <div className="absolute inset-0 rounded-2xl border-t-2 border-brand-500" />
          <div className="absolute inset-2 rounded-xl bg-gradient-brand opacity-80 flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">N</span>
          </div>
        </motion.div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-500"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function InlineLoader({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-2 border-surface-200 dark:border-surface-700 border-t-brand-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
