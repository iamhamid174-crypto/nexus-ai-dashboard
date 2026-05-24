import { motion } from 'framer-motion'

function SkeletonBox({ className = '' }) {
  return (
    <motion.div
      className={`skeleton relative overflow-hidden ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
    >
      <div className="absolute inset-0 shimmer" />
    </motion.div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-4 w-24 rounded-lg" />
        <SkeletonBox className="h-9 w-9 rounded-xl" />
      </div>
      <SkeletonBox className="h-8 w-32 rounded-lg" />
      <SkeletonBox className="h-3 w-20 rounded-lg" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonBox className="h-4 w-full rounded-lg" />
        </td>
      ))}
    </tr>
  )
}

export function ChartSkeleton({ height = 280 }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-5 w-32 rounded-lg" />
        <SkeletonBox className="h-8 w-28 rounded-xl" />
      </div>
      <SkeletonBox className={`w-full rounded-xl`} style={{ height }} />
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <SkeletonBox className="h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-3.5 w-3/4 rounded-lg" />
        <SkeletonBox className="h-3 w-1/2 rounded-lg" />
      </div>
      <SkeletonBox className="h-6 w-16 rounded-lg flex-shrink-0" />
    </div>
  )
}

export default SkeletonBox
