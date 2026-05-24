import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiCommand } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { toggleSearch } from '../../store/slices/uiSlice'

const QUICK_LINKS = [
  { label: 'Dashboard Overview', path: '/dashboard', category: 'Pages' },
  { label: 'Analytics', path: '/analytics', category: 'Pages' },
  { label: 'Projects', path: '/projects', category: 'Pages' },
  { label: 'Content Generator', path: '/ai-tools/content', category: 'AI Tools' },
  { label: 'Email Generator', path: '/ai-tools/email', category: 'AI Tools' },
  { label: 'Code Assistant', path: '/ai-tools/code', category: 'AI Tools' },
  { label: 'Social Media Generator', path: '/ai-tools/social', category: 'AI Tools' },
  { label: 'Image Prompt Generator', path: '/ai-tools/image', category: 'AI Tools' },
  { label: 'Billing & Plans', path: '/billing', category: 'Account' },
  { label: 'Profile Settings', path: '/profile', category: 'Account' },
  { label: 'App Settings', path: '/settings', category: 'Account' },
]

export default function SearchModal() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const searchOpen = useAppSelector((s) => s.ui.searchOpen)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const filtered = query
    ? QUICK_LINKS.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()))
    : QUICK_LINKS.slice(0, 6)

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [searchOpen])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        dispatch(toggleSearch())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch])

  const handleSelect = (path) => {
    navigate(path)
    dispatch(toggleSearch())
    setQuery('')
  }

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[998] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
            onClick={() => dispatch(toggleSearch())}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-xl glass-card overflow-hidden z-10"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200/50 dark:border-surface-700/50">
              <FiSearch className="text-surface-400 flex-shrink-0" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, tools, settings..."
                className="flex-1 bg-transparent text-surface-900 dark:text-surface-100 placeholder-surface-400 text-sm outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') dispatch(toggleSearch())
                  if (e.key === 'Enter' && filtered.length > 0) handleSelect(filtered[0].path)
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-surface-400 hover:text-surface-600">
                  <FiX size={15} />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-xs text-surface-400 border border-surface-300 dark:border-surface-600 rounded">
                <FiCommand size={10} /> K
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-3 py-1.5">{category}</p>
                  {items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 text-surface-700 dark:text-surface-300 text-sm transition-colors text-left"
                    >
                      <FiSearch size={14} className="text-surface-400" />
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-sm text-surface-400 py-8">No results found</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
