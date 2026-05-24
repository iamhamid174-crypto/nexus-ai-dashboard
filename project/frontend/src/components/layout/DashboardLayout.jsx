import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppSelector } from '../../hooks'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import ToastContainer from '../common/Toast'
import Modal from '../common/Modal'
import SearchModal from '../common/Search'

export default function DashboardLayout() {
  const { sidebarCollapsed } = useAppSelector((s) => s.ui)

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 bg-mesh-light dark:bg-mesh-dark">
      <Sidebar />
      <Navbar />

      {/* Main content area */}
      <motion.main
        className={`transition-all duration-300 pt-16 min-h-screen
          ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-[260px]'}
        `}
        initial={false}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-[calc(100vh-64px)]"
        >
          <Outlet />
        </motion.div>
      </motion.main>

      {/* Global overlays */}
      <ToastContainer />
      <Modal />
      <SearchModal />
    </div>
  )
}
