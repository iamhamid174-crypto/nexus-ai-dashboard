import { useState } from 'react'
import { FiMessageSquare } from 'react-icons/fi'
import { AIToolLayout } from '../../components/ai-tools/AIToolLayout'
import { sleep } from '../../utils/helpers'

const CONTENT_TYPES = ['Blog Post', 'Product Description', 'Social Caption', 'Landing Page', 'Ad Copy', 'Newsletter']
const TONES = ['Professional', 'Casual', 'Persuasive', 'Informative', 'Humorous', 'Inspirational']
const LENGTHS = ['Short (100-200 words)', 'Medium (300-500 words)', 'Long (800-1200 words)']

const SAMPLE_OUTPUTS = {
  'Blog Post': `# 5 Ways AI Is Transforming Content Marketing in 2025

The digital landscape has shifted dramatically. Brands that once relied on armies of content creators are now deploying AI tools to amplify their output — without sacrificing quality.

## 1. Scale Without Compromise

AI content platforms have democratized enterprise-grade copywriting. Tools like AI SAAS Dashboard can help with drafting and organizing content, while you focus on strategy.

## 2. Hyper-Personalization at Scale

Gone are the days of generic messaging. AI enables dynamic content that adapts to user behavior, geography, and intent. The result? Engagement rates that marketing teams could only dream of five years ago.

## 3. SEO That Actually Converts

Modern AI doesn't just stuff keywords — it understands semantic context, user intent, and Google's E-E-A-T framework. Your content ranks higher and converts better.

## The Bottom Line

The brands winning in 2025 aren't replacing humans with AI — they're amplifying human creativity with AI. The question isn't whether to adopt these tools. It's how fast.`,

  'Product Description': `**Sonic Pro Wireless Earbuds — Hear Everything, Miss Nothing**

Engineered for the way you actually live, the Sonic Pro delivers studio-grade audio in a featherweight form factor that disappears into your day.

**40-Hour Total Battery Life** — 10 hours on a single charge, 30 more in the case. Your commute, workout, and late-night sessions are covered.

**Adaptive Active Noise Cancellation** — Intelligent microphones sample your environment 50,000 times per second, sculpting silence around you on demand.

**Crystal-Clear Calls** — Four-mic array with AI beamforming isolates your voice, not the coffee shop behind you.

Available in Midnight Black, Arctic White, and Sage Green. Ships in 2 business days.`,
}

export default function ContentGeneratorPage() {
  const [form, setForm] = useState({
    topic: '',
    contentType: 'Blog Post',
    tone: 'Professional',
    length: 'Medium (300-500 words)',
    keywords: '',
  })
  const [output, setOutput] = useState('')
  const [generating, setGenerating] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const generate = async () => {
    if (!form.topic) return
    setGenerating(true)
    setOutput('')
    await sleep(2200)
    const sample = SAMPLE_OUTPUTS[form.contentType] || SAMPLE_OUTPUTS['Blog Post']
    setOutput(sample)
    setGenerating(false)
  }

  return (
    <AIToolLayout
      title="Content Generator"
      description="Create engaging content for any platform using AI"
      icon={FiMessageSquare}
      color="brand"
      output={output}
      generating={generating}
      onGenerate={generate}
      onClear={() => setOutput('')}
    >
      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Topic / Prompt *</label>
        <textarea
          rows={3}
          value={form.topic}
          onChange={(e) => set('topic', e.target.value)}
          placeholder="E.g. How AI is transforming content marketing in 2025..."
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Content Type</label>
          <select className="input-field" value={form.contentType} onChange={(e) => set('contentType', e.target.value)}>
            {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Tone</label>
          <select className="input-field" value={form.tone} onChange={(e) => set('tone', e.target.value)}>
            {TONES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Length</label>
        <select className="input-field" value={form.length} onChange={(e) => set('length', e.target.value)}>
          {LENGTHS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Keywords (optional)</label>
        <input
          className="input-field"
          value={form.keywords}
          onChange={(e) => set('keywords', e.target.value)}
          placeholder="SEO keywords, comma separated"
        />
      </div>
    </AIToolLayout>
  )
}
