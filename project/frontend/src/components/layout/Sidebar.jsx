import { useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiBarChart2, FiFolder, FiCreditCard, FiUser, FiSettings,
  FiZap, FiChevronLeft, FiX, FiLogOut, FiMessageSquare,
  FiMail, FiShare2, FiCode, FiImage
} from 'react-icons/fi'
import { useAppDispatch, useAppSelector, useAuth, useClickOutside, useWindowSize } from '../../hooks'
import { toggleSidebar, setSidebarOpen, toggleSidebarCollapsed } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'
import { getInitials } from '../../utils/helpers'

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { label: 'Analytics', path: '/analytics', icon: FiBarChart2 },
      { label: 'Projects', path: '/projects', icon: FiFolder },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { label: 'Content Generator', path: '/ai-tools/content', icon: FiMessageSquare },
      { label: 'Email Generator', path: '/ai-tools/email', icon: FiMail },
      { label: 'Social Media', path: '/ai-tools/social', icon: FiShare2 },
      { label: 'Code Assistant', path: '/ai-tools/code', icon: FiCode },
      { label: 'Image Prompt', path: '/ai-tools/image', icon: FiImage },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Billing', path: '/billing', icon: FiCreditCard },
      { label: 'Profile', path: '/profile', icon: FiUser },
      { label: 'Settings', path: '/settings', icon: FiSettings },
    ],
  },
]

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'nav-item-active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
      }
    >
      <item.icon size={17} className="flex-shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )
}

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((s) => s.ui)
  const { user } = useAuth()
  const { width } = useWindowSize()
  const isMobile = width < 1024
  const ref = useRef(null)

  useClickOutside(ref, () => {
    if (isMobile && sidebarOpen) dispatch(setSidebarOpen(false))
  })

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-surface-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={ref}
        initial={false}
        animate={isMobile ? (sidebarOpen ? 'open' : 'closed') : 'open'}
        variants={isMobile ? sidebarVariants : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className={`fixed top-0 left-0 h-full z-40 flex flex-col
          bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl
          border-r border-surface-200/50 dark:border-surface-800/50
          transition-all duration-300
          ${sidebarCollapsed && !isMobile ? 'w-16' : 'w-[260px]'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-surface-200/50 dark:border-surface-800/50 flex-shrink-0 ${sidebarCollapsed ? 'justify-center' : 'gap-3 justify-between'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow-brand">
              <FiZap size={16} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-display font-bold text-surface-900 dark:text-surface-100 text-base">SAAS</span>
                <span className="gradient-text font-display font-bold text-base"> AI</span>
              </div>
            )}
          </div>

          {/* Mobile close */}
          {isMobile && (
            <button onClick={() => dispatch(setSidebarOpen(false))} className="text-surface-400 hover:text-surface-600">
              <FiX size={18} />
            </button>
          )}

          {/* Collapse toggle (desktop) */}
          {!isMobile && !sidebarCollapsed && (
            <button
              onClick={() => dispatch(toggleSidebarCollapsed())}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              <FiChevronLeft size={14} />
            </button>
          )}
          {!isMobile && sidebarCollapsed && (
            <button
              onClick={() => dispatch(toggleSidebarCollapsed())}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all rotate-180"
            >
              <FiChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-4 px-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              {!sidebarCollapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 px-3 mb-1.5">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-surface-200/50 dark:border-surface-800/50 p-3 flex-shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {getInitials(user?.name || 'U')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{user?.name || 'Demo User'}</p>
                <p className="text-[10px] text-surface-400 truncate">{user?.plan || 'pro'} plan</p>
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all"
                title="Logout"
              >
                <FiLogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => dispatch(logout())}
              className="w-full flex items-center justify-center py-2 text-surface-400 hover:text-danger-500 transition-colors"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  )
}
