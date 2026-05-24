import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useAppDispatch, useTheme } from '../../hooks'
import { toggleTheme } from '../../store/slices/themeSlice'

export default function ThemeToggle({ className = '' }) {
  const dispatch = useAppDispatch()
  const { mode } = useTheme()
  const isDark = mode === 'dark'

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => dispatch(toggleTheme())}
      className={`relative w-9 h-9 flex items-center justify-center rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-all duration-200 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
      </motion.div>
    </motion.button>
  )
}
