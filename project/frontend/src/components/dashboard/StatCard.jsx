import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { formatNumber } from '../../utils/helpers'

export default function StatCard({ title, value, growth, prefix = '', suffix = '', icon: Icon, color = 'brand', index = 0 }) {
  const isPositive = growth >= 0

  const colorMap = {
    brand: 'from-brand-500/20 to-brand-600/10 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30',
    accent: 'from-accent-500/20 to-accent-600/10 text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/30',
    success: 'from-success-500/20 to-success-600/10 text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/30',
    warning: 'from-warning-500/20 to-warning-600/10 text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card-hover p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color].split(' ').slice(2).join(' ')}`}>
          <Icon size={17} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-display font-bold text-surface-900 dark:text-surface-100 tabular-nums">
          {prefix}{typeof value === 'number' ? formatNumber(value) : value}{suffix}
        </p>

        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-500'}`}>
            {isPositive ? <FiTrendingUp size={13} /> : <FiTrendingDown size={13} />}
            <span>{isPositive ? '+' : ''}{growth}%</span>
            <span className="font-normal text-surface-400 ml-1">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
