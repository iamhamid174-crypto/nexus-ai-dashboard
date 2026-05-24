import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { closeModal } from '../../store/slices/uiSlice'

export default function Modal({ children, title, size = 'md', className = '' }) {
  const dispatch = useAppDispatch()
  const { activeModal } = useAppSelector((s) => s.ui)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') dispatch(closeModal())
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [dispatch])

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activeModal])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm"
            onClick={() => dispatch(closeModal())}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative w-full ${sizes[size]} glass-card shadow-glass-dark overflow-hidden ${className}`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-surface-700/50">
                <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">{title}</h2>
                <button
                  onClick={() => dispatch(closeModal())}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[80vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
