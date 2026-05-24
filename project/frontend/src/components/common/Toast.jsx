import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { removeToast } from '../../store/slices/uiSlice'
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi'

const icons = {
  success: <FiCheckCircle className="text-success-500" size={18} />,
  error: <FiAlertCircle className="text-danger-500" size={18} />,
  warning: <FiAlertTriangle className="text-warning-500" size={18} />,
  info: <FiInfo className="text-brand-500" size={18} />,
}

const borderColors = {
  success: 'border-l-success-500',
  error: 'border-l-danger-500',
  warning: 'border-l-warning-500',
  info: 'border-l-brand-500',
}

function Toast({ toast }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id))
    }, toast.duration || 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, dispatch])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`glass-card border-l-4 ${borderColors[toast.type]} p-4 flex items-start gap-3 min-w-[300px] max-w-[400px] cursor-pointer`}
      onClick={() => dispatch(removeToast(toast.id))}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); dispatch(removeToast(toast.id)) }}
        className="flex-shrink-0 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
      >
        <FiX size={15} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const toasts = useAppSelector((s) => s.ui.toasts)

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
