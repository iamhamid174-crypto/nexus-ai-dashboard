// Demo mock data used when backend is unavailable

export const MOCK_USER = {
  _id: 'demo-user-001',
  name: 'Workspace Admin',
  email: 'admin@example.com',
  role: 'admin',
  avatar: null,
  plan: 'pro',
  createdAt: '2024-01-15T10:00:00Z',
}

export const MOCK_STATS = {
  totalRevenue: 148520,
  revenueGrowth: 18.4,
  totalUsers: 24319,
  userGrowth: 12.7,
  aiRequests: 1284920,
  aiGrowth: 34.2,
  activeProjects: 87,
  projectGrowth: 8.1,
}

export const MOCK_REVENUE_DATA = [
  { month: 'Jan', revenue: 42000, expenses: 28000 },
  { month: 'Feb', revenue: 48000, expenses: 30000 },
  { month: 'Mar', revenue: 55000, expenses: 32000 },
  { month: 'Apr', revenue: 51000, expenses: 29000 },
  { month: 'May', revenue: 62000, expenses: 35000 },
  { month: 'Jun', revenue: 68000, expenses: 37000 },
  { month: 'Jul', revenue: 74000, expenses: 38000 },
  { month: 'Aug', revenue: 79000, expenses: 40000 },
  { month: 'Sep', revenue: 85000, expenses: 42000 },
  { month: 'Oct', revenue: 91000, expenses: 43000 },
  { month: 'Nov', revenue: 98000, expenses: 45000 },
  { month: 'Dec', revenue: 112000, expenses: 48000 },
]

export const MOCK_USER_GROWTH = [
  { month: 'Jan', users: 8200 },
  { month: 'Feb', users: 9400 },
  { month: 'Mar', users: 10800 },
  { month: 'Apr', users: 12200 },
  { month: 'May', users: 13900 },
  { month: 'Jun', users: 15600 },
  { month: 'Jul', users: 17200 },
  { month: 'Aug', users: 18900 },
  { month: 'Sep', users: 20100 },
  { month: 'Oct', users: 21800 },
  { month: 'Nov', users: 23100 },
  { month: 'Dec', users: 24319 },
]

export const MOCK_AI_USAGE = [
  { tool: 'Content Gen', requests: 420000, color: '#2563eb' },
  { tool: 'Code Assist', requests: 310000, color: '#d946ef' },
  { tool: 'Email Gen', requests: 220000, color: '#22c55e' },
  { tool: 'Social Media', requests: 180000, color: '#f59e0b' },
  { tool: 'Image Prompt', requests: 154920, color: '#ef4444' },
]

export const MOCK_TRAFFIC = [
  { name: 'Organic Search', value: 42, color: '#2563eb' },
  { name: 'Direct', value: 28, color: '#d946ef' },
  { name: 'Social Media', value: 18, color: '#22c55e' },
  { name: 'Referral', value: 12, color: '#f59e0b' },
]

export const MOCK_PROJECTS = [
  { _id: 'p1', name: 'Marketing Campaign Q4', status: 'active', description: 'End of year marketing push across all channels', aiTool: 'content-generator', usage: 78, createdAt: '2024-11-01T10:00:00Z', dueDate: '2024-12-31T00:00:00Z' },
  { _id: 'p2', name: 'Customer Support Bot', status: 'completed', description: 'AI-powered support ticket automation system', aiTool: 'code-assistant', usage: 100, createdAt: '2024-10-01T10:00:00Z', dueDate: '2024-11-30T00:00:00Z' },
  { _id: 'p3', name: 'Social Media Automation', status: 'active', description: 'Automated posting schedule for all platforms', aiTool: 'social-media', usage: 55, createdAt: '2024-11-15T10:00:00Z', dueDate: '2025-01-15T00:00:00Z' },
  { _id: 'p4', name: 'Product Launch Emails', status: 'paused', description: 'Email sequence for new product launch', aiTool: 'email-generator', usage: 30, createdAt: '2024-11-10T10:00:00Z', dueDate: '2025-01-01T00:00:00Z' },
  { _id: 'p5', name: 'Visual Brand Assets', status: 'active', description: 'AI-generated imagery for brand guidelines', aiTool: 'image-prompt', usage: 62, createdAt: '2024-12-01T10:00:00Z', dueDate: '2025-02-01T00:00:00Z' },
  { _id: 'p6', name: 'Dev Documentation', status: 'draft', description: 'Technical docs for internal developer portal', aiTool: 'code-assistant', usage: 10, createdAt: '2024-12-05T10:00:00Z', dueDate: '2025-03-01T00:00:00Z' },
]

export const MOCK_NOTIFICATIONS = [
  { _id: 'n1', title: 'Subscription Renewed', message: 'Your Pro plan has been renewed for another month.', type: 'success', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { _id: 'n2', title: 'AI Usage Alert', message: "You've used 80% of your monthly AI credits.", type: 'warning', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { _id: 'n3', title: 'Project Completed', message: 'Customer Support Bot project has been marked complete.', type: 'info', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { _id: 'n4', title: 'New Team Member', message: 'A new teammate joined your workspace.', type: 'info', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { _id: 'n5', title: 'Report Ready', message: 'Your November analytics report is now available.', type: 'success', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
]

export const MOCK_ACTIVITY = [
  { id: 'a1', action: 'Created project', subject: 'Visual Brand Assets', user: 'You', time: '5 min ago', type: 'project' },
  { id: 'a2', action: 'Generated content for', subject: 'Marketing Campaign Q4', user: 'You', time: '22 min ago', type: 'ai' },
  { id: 'a3', action: 'Invited', subject: 'teammate@example.com', user: 'You', time: '1 hr ago', type: 'user' },
  { id: 'a4', action: 'Completed project', subject: 'Customer Support Bot', user: 'System', time: '3 hr ago', type: 'project' },
  { id: 'a5', action: 'Upgraded plan to', subject: 'Pro Annual', user: 'You', time: '1 day ago', type: 'billing' },
]
