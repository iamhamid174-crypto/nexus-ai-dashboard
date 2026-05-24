import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiCopy, FiRefreshCw, FiDownload } from 'react-icons/fi'
import { useToast } from '../../hooks'

export function AIToolLayout({ title, description, icon: Icon, color = 'brand', children, output, generating, onGenerate, onClear }) {
  const toast = useToast()

  const copyOutput = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success('Copied!', 'Output copied to clipboard.')
  }

  const downloadOutput = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-output.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  const colorMap = {
    brand: 'from-brand-500 to-brand-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-danger-500 to-danger-600',
  }

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-glow-brand`}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-surface-900 dark:text-surface-100">{title}</h2>
            <p className="text-xs text-surface-400">{description}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Input panel */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card p-5 h-full">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-4">Configuration</h3>
            <div className="space-y-4">
              {children}
              <button
                onClick={onGenerate}
                disabled={generating}
                className="btn-brand w-full justify-center py-3"
              >
                {generating ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                    <FiRefreshCw size={15} />
                  </motion.div> Generating...</>
                ) : (
                  <><FiZap size={15} /> Generate</>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Output panel */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <div className="glass-card p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Output</h3>
              {output && (
                <div className="flex items-center gap-1">
                  <button onClick={copyOutput} className="btn-ghost py-1 px-2.5 text-xs"><FiCopy size={12} /> Copy</button>
                  <button onClick={downloadOutput} className="btn-ghost py-1 px-2.5 text-xs"><FiDownload size={12} /> Save</button>
                  <button onClick={onClear} className="btn-ghost py-1 px-2.5 text-xs">Clear</button>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-[320px] relative">
              {generating ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mx-auto mb-3`}
                    >
                      <FiZap size={22} className="text-white" />
                    </motion.div>
                    <p className="text-sm text-surface-500">AI is generating...</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[0,1,2].map((i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-500"
                          animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i*0.2 }} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : output ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                  <textarea
                    readOnly
                    value={output}
                    className="w-full h-full min-h-[320px] code-block bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-200 resize-none outline-none border-0 font-body text-sm leading-relaxed"
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl">
                  <div className="text-center">
                    <FiZap size={24} className="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
                    <p className="text-sm text-surface-400">Configure and generate to see output here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
