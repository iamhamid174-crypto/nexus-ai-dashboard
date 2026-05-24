import { motion } from 'framer-motion'
import { FiFolder, FiZap, FiUser, FiCreditCard, FiActivity } from 'react-icons/fi'
import { MOCK_ACTIVITY } from '../../utils/mockData'

const typeConfig = {
  project: { icon: FiFolder, color: 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' },
  ai: { icon: FiZap, color: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' },
  user: { icon: FiUser, color: 'bg-success-50 dark:bg-success-900/30 text-success-600 dark:text-success-400' },
  billing: { icon: FiCreditCard, color: 'bg-warning-50 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400' },
}

export default function ActivityFeed({ items = MOCK_ACTIVITY }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <FiActivity size={16} className="text-brand-500" />
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Recent Activity</h3>
      </div>

      <div className="space-y-0.5">
        {items.map((item, i) => {
          const cfg = typeConfig[item.type] || typeConfig.project
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                <cfg.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-surface-700 dark:text-surface-300">
                  <span className="font-medium">{item.user}</span>{' '}
                  {item.action}{' '}
                  <span className="font-semibold text-brand-600 dark:text-brand-400 truncate">{item.subject}</span>
                </p>
                <p className="text-[10px] text-surface-400 mt-0.5">{item.time}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
