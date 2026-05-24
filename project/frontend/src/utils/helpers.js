export const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)

export const formatNumber = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value?.toString() || '0'
}

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const truncate = (str, len = 40) =>
  str?.length > len ? `${str.slice(0, len)}...` : str

export const statusConfig = {
  active: { label: 'Active', className: 'badge-success' },
  completed: { label: 'Completed', className: 'badge-brand' },
  paused: { label: 'Paused', className: 'badge-warning' },
  draft: { label: 'Draft', className: 'badge-accent' },
  cancelled: { label: 'Cancelled', className: 'badge-danger' },
}

export const aiToolConfig = {
  'content-generator': { label: 'Content Generator', icon: '✍️', color: 'brand' },
  'email-generator': { label: 'Email Generator', icon: '📧', color: 'success' },
  'social-media': { label: 'Social Media', icon: '📱', color: 'accent' },
  'code-assistant': { label: 'Code Assistant', icon: '💻', color: 'warning' },
  'image-prompt': { label: 'Image Prompt', icon: '🎨', color: 'danger' },
}

export const debounce = (fn, ms = 300) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
