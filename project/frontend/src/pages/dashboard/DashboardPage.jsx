import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiDollarSign, FiUsers, FiZap, FiFolder, FiArrowRight
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAuth } from '../../hooks'
import { fetchDashboardStats } from '../../store/slices/analyticsSlice'
import StatCard from '../../components/dashboard/StatCard'
import RevenueChart from '../../components/dashboard/RevenueChart'
import AIUsageChart from '../../components/dashboard/AIUsageChart'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import { MOCK_STATS, MOCK_PROJECTS } from '../../utils/mockData'
import { statusConfig, formatDate } from '../../utils/helpers'

const STATS = [
  { title: 'Total Revenue', value: MOCK_STATS.totalRevenue, growth: MOCK_STATS.revenueGrowth, prefix: '$', icon: FiDollarSign, color: 'brand' },
  { title: 'Total Users', value: MOCK_STATS.totalUsers, growth: MOCK_STATS.userGrowth, icon: FiUsers, color: 'accent' },
  { title: 'AI Requests', value: MOCK_STATS.aiRequests, growth: MOCK_STATS.aiGrowth, icon: FiZap, color: 'success' },
  { title: 'Active Projects', value: MOCK_STATS.activeProjects, growth: MOCK_STATS.projectGrowth, icon: FiFolder, color: 'warning' },
]

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchDashboardStats()).catch(() => {})
  }, [dispatch])

  const recentProjects = MOCK_PROJECTS.slice(0, 4)

  return (
    <div className="page-container">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-display font-bold text-surface-900 dark:text-surface-100">
          Good morning, {user?.name?.split(' ')[0] || 'there'} 👋
        </h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Here's what's happening in your workspace today.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map((stat, i) => (
          <StatCard key={stat.title} {...stat} index={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <AIUsageChart />
        </div>
      </div>

      {/* Projects + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Projects */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="section-header">
            <div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Recent Projects</h3>
              <p className="text-xs text-surface-400 mt-0.5">Your latest workspace activity</p>
            </div>
            <button onClick={() => navigate('/projects')} className="btn-ghost text-xs">
              View all <FiArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {recentProjects.map((project, i) => {
              const cfg = statusConfig[project.status] || statusConfig.active
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/projects')}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-brand opacity-80 flex items-center justify-center flex-shrink-0">
                    <FiFolder size={15} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{project.name}</p>
                    <p className="text-[10px] text-surface-400">Due {formatDate(project.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:block w-20">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${project.usage}%` }} />
                      </div>
                      <p className="text-[10px] text-surface-400 mt-0.5 text-right">{project.usage}%</p>
                    </div>
                    <span className={cfg.className}>{cfg.label}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Activity */}
        <ActivityFeed />
      </div>
    </div>
  )
}
