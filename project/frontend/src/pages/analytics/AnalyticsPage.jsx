import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { MOCK_REVENUE_DATA, MOCK_USER_GROWTH, MOCK_AI_USAGE, MOCK_TRAFFIC } from '../../utils/mockData'
import { formatCurrency, formatNumber } from '../../utils/helpers'

const PERIODS = ['7d', '30d', '90d', '12m']

const CustomTooltip = ({ active, payload, label, prefix = '', isCurrency }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2.5 text-xs shadow-glass-dark">
      <p className="font-semibold text-surface-900 dark:text-surface-100 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <strong>{isCurrency ? formatCurrency(p.value) : `${prefix}${formatNumber(p.value)}`}</strong>
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, sub, children, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">{title}</h3>
          {sub && <p className="text-xs text-surface-400 mt-0.5">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d')

  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-surface-100">Analytics</h2>
          <p className="text-xs text-surface-400 mt-1">Performance insights and trends</p>
        </div>
        <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                period === p
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue line chart */}
      <div className="mb-4">
        <ChartCard
          title="Revenue & Expenses"
          sub="Monthly breakdown"
          action={<span className="badge badge-success">+18.4% vs last year</span>}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MOCK_REVENUE_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip isCurrency />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5}
                dot={false} activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#d946ef" strokeWidth={2}
                dot={false} strokeDasharray="5 4" activeDot={{ r: 5, fill: '#d946ef', stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* User Growth Bar Chart */}
        <ChartCard title="User Growth" sub="Cumulative user base">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MOCK_USER_GROWTH} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => formatNumber(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" name="Users" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Traffic Sources Pie */}
        <ChartCard title="Traffic Sources" sub="Distribution by channel">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={200}>
              <PieChart>
                <Pie data={MOCK_TRAFFIC} cx="50%" cy="50%" outerRadius={80} innerRadius={52}
                  dataKey="value" paddingAngle={3} stroke="none">
                  {MOCK_TRAFFIC.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip content={({ active, payload }) =>
                  active && payload?.[0] ? (
                    <div className="glass-card px-3 py-2 text-xs">
                      <p className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
                      <p className="text-surface-900 dark:text-surface-100">{payload[0].value}%</p>
                    </div>
                  ) : null
                } />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {MOCK_TRAFFIC.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-surface-600 dark:text-surface-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-surface-900 dark:text-surface-100">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* AI Usage Bar */}
      <ChartCard title="AI Tool Performance" sub="Requests by tool this period">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MOCK_AI_USAGE} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => formatNumber(v)} />
            <YAxis type="category" dataKey="tool" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="requests" name="Requests" radius={[0, 6, 6, 0]}>
              {MOCK_AI_USAGE.map((entry) => (
                <Cell key={entry.tool} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
