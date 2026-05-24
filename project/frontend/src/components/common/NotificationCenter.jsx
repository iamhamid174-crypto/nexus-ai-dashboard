import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiX, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { closeNotificationPanel, toggleNotificationPanel } from '../../store/slices/uiSlice'
import { fetchNotifications, markAllRead, markOneRead } from '../../store/slices/notificationSlice'
import { formatRelativeTime } from '../../utils/helpers'
import { MOCK_NOTIFICATIONS } from '../../utils/mockData'

const typeIcons = {
  success: <FiCheckCircle className="text-success-500" size={15} />,
  warning: <FiAlertTriangle className="text-warning-500" size={15} />,
  info: <FiInfo className="text-brand-500" size={15} />,
  error: <FiAlertTriangle className="text-danger-500" size={15} />,
}

export default function NotificationCenter() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((s) => s.ui.notificationPanelOpen)
  const { items, unreadCount } = useAppSelector((s) => s.notifications)

  const notifications = items.length > 0 ? items : MOCK_NOTIFICATIONS

  useEffect(() => {
    dispatch(fetchNotifications()).catch(() => {})
  }, [dispatch])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => dispatch(toggleNotificationPanel())}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-all duration-200"
        aria-label="Notifications"
      >
        <FiBell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => dispatch(closeNotificationPanel())}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute top-full right-0 mt-2 w-80 sm:w-96 glass-card shadow-glass-dark z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200/50 dark:border-surface-700/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-brand">{unreadCount} new</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllRead())}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline mr-2"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => dispatch(closeNotificationPanel())}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="max-h-96 overflow-y-auto divide-y divide-surface-200/30 dark:divide-surface-700/30">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-sm text-surface-400">
                    <FiBell size={24} className="mx-auto mb-2 opacity-30" />
                    <p>All caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      onClick={() => dispatch(markOneRead(n._id))}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors ${
                        !n.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">{typeIcons[n.type] || typeIcons.info}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${!n.read ? 'text-surface-900 dark:text-surface-100' : 'text-surface-600 dark:text-surface-400'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-surface-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
