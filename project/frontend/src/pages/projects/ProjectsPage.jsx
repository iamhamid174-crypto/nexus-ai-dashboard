import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiFolder, FiMoreVertical,
  FiChevronDown, FiFilter
} from 'react-icons/fi'
import { useAppDispatch, useAppSelector, useToast } from '../../hooks'
import { fetchProjects, createProject, updateProject, deleteProject, setSelectedProject } from '../../store/slices/projectSlice'
import { openModal, closeModal } from '../../store/slices/uiSlice'
import { useAppSelector as useSelector } from '../../hooks'
import Modal from '../../components/common/Modal'
import { MOCK_PROJECTS, MOCK_AI_USAGE } from '../../utils/mockData'
import { statusConfig, aiToolConfig, formatDate, truncate } from '../../utils/helpers'
import { TableRowSkeleton } from '../../components/common/Skeleton'

const STATUSES = ['all', 'active', 'completed', 'paused', 'draft']
const AI_TOOLS = ['all', 'content-generator', 'email-generator', 'social-media', 'code-assistant', 'image-prompt']

function ProjectForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(initial || { name: '', description: '', status: 'active', aiTool: 'content-generator', dueDate: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Project Name *</label>
        <input className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="E.g. Q4 Marketing Campaign" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Description</label>
        <textarea className="input-field resize-none" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Project description..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Status</label>
          <select className="input-field" value={form.status} onChange={(e) => set('status', e.target.value)}>
            {['active', 'draft', 'paused', 'completed'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">AI Tool</label>
          <select className="input-field" value={form.aiTool} onChange={(e) => set('aiTool', e.target.value)}>
            {AI_TOOLS.slice(1).map((t) => (
              <option key={t} value={t}>{aiToolConfig[t]?.label || t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Due Date</label>
        <input type="date" className="input-field" value={form.dueDate?.slice(0, 10) || ''} onChange={(e) => set('dueDate', e.target.value)} />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSubmit(form)} disabled={loading || !form.name}
          className="btn-brand flex-1 justify-center">
          {loading ? 'Saving...' : initial ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { items, loading } = useAppSelector((s) => s.projects)
  const { activeModal, modalData } = useAppSelector((s) => s.ui)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionMenu, setActionMenu] = useState(null)
  const [saving, setSaving] = useState(false)

  const projects = items.length > 0 ? items : MOCK_PROJECTS

  useEffect(() => {
    dispatch(fetchProjects({})).catch(() => {})
  }, [dispatch])

  const filtered = projects.filter((p) => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase())
    const matchS = statusFilter === 'all' || p.status === statusFilter
    return matchQ && matchS
  })

  const handleCreate = async (form) => {
    setSaving(true)
    try {
      await dispatch(createProject(form)).unwrap()
      toast.success('Project created!', `"${form.name}" has been added.`)
    } catch {
      toast.success('Project created!', `"${form.name}" added (demo mode).`)
    }
    dispatch(closeModal())
    setSaving(false)
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try {
      await dispatch(updateProject({ id: modalData._id, ...form })).unwrap()
      toast.success('Project updated!', 'Changes saved.')
    } catch {
      toast.success('Project updated!', 'Changes saved (demo).')
    }
    dispatch(closeModal())
    setSaving(false)
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await dispatch(deleteProject(id)).unwrap()
      toast.success('Deleted!', `"${name}" removed.`)
    } catch {
      toast.success('Deleted!', `"${name}" removed (demo).`)
    }
    setActionMenu(null)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-surface-100">Projects</h2>
          <p className="text-xs text-surface-400 mt-1">{filtered.length} of {projects.length} projects</p>
        </div>
        <button onClick={() => dispatch(openModal({ modal: 'create-project' }))} className="btn-brand">
          <FiPlus size={15} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="input-field pl-9 h-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === s ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden sm:table-cell">AI Tool</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden lg:table-cell">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden xl:table-cell">Due Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200/30 dark:divide-surface-700/30">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-surface-400 text-sm">
                    <FiFolder size={32} className="mx-auto mb-3 opacity-30" />
                    No projects found
                  </td>
                </tr>
              ) : (
                filtered.map((project, i) => {
                  const statusCfg = statusConfig[project.status] || statusConfig.active
                  const toolCfg = aiToolConfig[project.aiTool] || {}
                  return (
                    <motion.tr
                      key={project._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-brand opacity-80 flex items-center justify-center flex-shrink-0">
                            <FiFolder size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-surface-900 dark:text-surface-100 text-xs">{truncate(project.name, 30)}</p>
                            <p className="text-[11px] text-surface-400 hidden sm:block">{truncate(project.description, 35)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-surface-600 dark:text-surface-400">
                          {toolCfg.icon} {toolCfg.label || project.aiTool}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={statusCfg.className}>{statusCfg.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="progress-bar w-20">
                            <div className="progress-fill" style={{ width: `${project.usage}%` }} />
                          </div>
                          <span className="text-[11px] text-surface-500">{project.usage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-surface-500 hidden xl:table-cell">
                        {project.dueDate ? formatDate(project.dueDate) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => dispatch(openModal({ modal: 'edit-project', data: project }))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id, project.name)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'create-project' && (
        <Modal title="New Project" size="md">
          <ProjectForm onSubmit={handleCreate} loading={saving} />
        </Modal>
      )}
      {activeModal === 'edit-project' && modalData && (
        <Modal title="Edit Project" size="md">
          <ProjectForm initial={modalData} onSubmit={handleUpdate} loading={saving} />
        </Modal>
      )}
    </div>
  )
}
