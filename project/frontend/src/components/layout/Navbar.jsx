import { useLocation } from 'react-router-dom'
import { FiMenu, FiCommand } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { toggleSidebar, toggleSearch } from '../../store/slices/uiSlice'
import ThemeToggle from '../common/ThemeToggle'
import NotificationCenter from '../common/NotificationCenter'
import { getInitials } from '../../utils/helpers'
import { useAuth } from '../../hooks'
import { useNavigate } from 'react-router-dom'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Your workspace overview' },
  '/analytics': { title: 'Analytics', sub: 'Performance insights' },
  '/projects': { title: 'Projects', sub: 'Manage your projects' },
  '/ai-tools/content': { title: 'Content Generator', sub: 'AI-powered content creation' },
  '/ai-tools/email': { title: 'Email Generator', sub: 'Smart email composition' },
  '/ai-tools/social': { title: 'Social Media', sub: 'Social post creation' },
  '/ai-tools/code': { title: 'Code Assistant', sub: 'AI programming help' },
  '/ai-tools/image': { title: 'Image Prompt', sub: 'Visual prompt engineering' },
  '/billing': { title: 'Billing', sub: 'Plans & payments' },
  '/profile': { title: 'Profile', sub: 'Your account details' },
  '/settings': { title: 'Settings', sub: 'App preferences' },
}

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { sidebarCollapsed } = useAppSelector((s) => s.ui)
  const { user } = useAuth()
  const location = useLocation()

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'AI SAAS Dashboard', sub: '' }

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6
        bg-white/70 dark:bg-surface-900/70 backdrop-blur-xl
        border-b border-surface-200/50 dark:border-surface-800/50
        transition-all duration-300
        ${sidebarCollapsed ? 'left-16' : 'left-0 lg:left-[260px]'}
      `}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-all lg:hidden"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={18} />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-surface-900 dark:text-surface-100 leading-tight">
            {pageInfo.title}
          </h1>
          {pageInfo.sub && (
            <p className="text-[11px] text-surface-400">{pageInfo.sub}</p>
          )}
        </div>
      </div>

      {/* Right: search, theme, notifications, avatar */}
      <div className="flex items-center gap-1.5">
        {/* Search trigger */}
        <button
          onClick={() => dispatch(toggleSearch())}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors text-xs"
        >
          <FiCommand size={13} />
          <span className="hidden sm:block">Search</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] px-1 py-0.5 bg-white dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600">
            K
          </kbd>
        </button>

        <ThemeToggle />

        {/* Notifications wrapper (relative for dropdown) */}
        <div className="relative">
          <NotificationCenter />
        </div>

        {/* Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold ml-1 ring-2 ring-white dark:ring-surface-800 hover:ring-brand-300 transition-all"
          title="Profile"
        >
          {getInitials(user?.name || 'U')}
        </button>
      </div>
    </header>
  )
}
