import { useState } from 'react'
import { FiMail } from 'react-icons/fi'
import { AIToolLayout } from '../../components/ai-tools/AIToolLayout'
import { sleep } from '../../utils/helpers'

const EMAIL_TYPES = ['Cold Outreach', 'Follow-up', 'Sales Pitch', 'Onboarding', 'Newsletter', 'Apology', 'Thank You', 'Announcement']
const TONES = ['Professional', 'Friendly', 'Formal', 'Casual', 'Urgent']

const SAMPLE_EMAIL = `Subject: Quick question about [Company Name]'s content strategy

Hi [First Name],

I noticed [Company Name] recently launched your new product line — congratulations! The positioning looks really strong.

I work with SaaS teams like yours to 3x content output without adding headcount. We do this through our AI-powered workspace that handles everything from blog drafts to email sequences.

I thought it might be relevant given where you're scaling. Would you be open to a 20-minute call this week to see if it's a fit?

Here’s a link to schedule time: [scheduling link]

Either way, happy to share some of the case studies from similar companies if helpful.

Best,
[Your Name]
[Your Title], [Company]
[your@email.com] | [phone]`

export default function EmailGeneratorPage() {
  const [form, setForm] = useState({
    emailType: 'Cold Outreach',
    senderName: '',
    senderRole: '',
    recipientName: '',
    company: '',
    goal: '',
    tone: 'Professional',
    callToAction: '',
  })
  const [output, setOutput] = useState('')
  const [generating, setGenerating] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const generate = async () => {
    setGenerating(true)
    setOutput('')
    await sleep(1800)
    setOutput(SAMPLE_EMAIL)
    setGenerating(false)
  }

  return (
    <AIToolLayout
      title="Email Generator"
      description="Craft high-converting emails for any purpose"
      icon={FiMail}
      color="success"
      output={output}
      generating={generating}
      onGenerate={generate}
      onClear={() => setOutput('')}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Email Type</label>
          <select className="input-field" value={form.emailType} onChange={(e) => set('emailType', e.target.value)}>
            {EMAIL_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Tone</label>
          <select className="input-field" value={form.tone} onChange={(e) => set('tone', e.target.value)}>
            {TONES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Your Name</label>
          <input className="input-field" value={form.senderName} onChange={(e) => set('senderName', e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Your Role</label>
          <input className="input-field" value={form.senderRole} onChange={(e) => set('senderRole', e.target.value)} placeholder="Your title" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Recipient</label>
          <input className="input-field" value={form.recipientName} onChange={(e) => set('recipientName', e.target.value)} placeholder="First name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Company</label>
          <input className="input-field" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Their company" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Email Goal</label>
        <textarea
          rows={2}
          className="input-field resize-none"
          value={form.goal}
          onChange={(e) => set('goal', e.target.value)}
          placeholder="What do you want to achieve? (e.g. book a demo, get a reply, announce a feature)"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Call to Action</label>
        <input className="input-field" value={form.callToAction} onChange={(e) => set('callToAction', e.target.value)} placeholder="Schedule a call, Visit website..." />
      </div>
    </AIToolLayout>
  )
}
