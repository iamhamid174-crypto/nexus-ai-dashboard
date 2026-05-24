import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { MOCK_AI_USAGE } from '../../utils/mockData'
import { formatNumber } from '../../utils/helpers'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="glass-card px-3 py-2 text-xs shadow-glass-dark">
      <p className="font-semibold text-surface-900 dark:text-surface-100">{d.name}</p>
      <p style={{ color: d.payload.color }}>{formatNumber(d.value)} requests</p>
    </div>
  )
}

export default function AIUsageChart({ data = MOCK_AI_USAGE }) {
  const total = data.reduce((s, d) => s + d.requests, 0)

  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">AI Tool Usage</h3>
        <p className="text-xs text-surface-400 mt-0.5">{formatNumber(total)} total requests</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={65}
                dataKey="requests" nameKey="tool" stroke="none" paddingAngle={2}>
                {data.map((entry) => (
                  <Cell key={entry.tool} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-display font-bold text-surface-900 dark:text-surface-100">
                {formatNumber(total)}
              </p>
              <p className="text-[10px] text-surface-400">total</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => {
            const pct = Math.round((item.requests / total) * 100)
            return (
              <div key={item.tool}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-[11px] text-surface-600 dark:text-surface-400 truncate">{item.tool}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-surface-700 dark:text-surface-300">{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
