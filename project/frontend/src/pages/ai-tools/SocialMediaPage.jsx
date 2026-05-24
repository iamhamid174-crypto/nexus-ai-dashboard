import { useState } from 'react'
import { FiShare2 } from 'react-icons/fi'
import { AIToolLayout } from '../../components/ai-tools/AIToolLayout'
import { sleep } from '../../utils/helpers'

const PLATFORMS = ['Twitter/X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'Threads']
const GOALS = ['Brand Awareness', 'Lead Generation', 'Product Launch', 'Community Engagement', 'Event Promotion', 'Educational']

const SAMPLE_SOCIAL = {
  'LinkedIn': `🚀 We just hit 24,000 users.

Here's what I wish I'd known before building an AI SaaS:

1. Your biggest competitor isn't another startup. It's your users' habits.

2. Every feature you build should answer: "Does this make someone's Monday morning better?"

3. Speed of learning > speed of shipping. Talk to 5 users before writing a single line of code.

Teams using AI SAAS Dashboard save time by keeping tasks, reports, and approvals in one place.

What's the biggest lesson your product journey has taught you? ↓

#SaaS #AITools #ProductManagement #Startups`,

  'Twitter/X': `We just hit 24K users 🎉

The secret? We stopped thinking about "AI features" and started thinking about Monday morning problems.

What's the most annoying part of your content workflow? 

We might already be building the solution 👇`,

  'Instagram': `24,000 teams can't be wrong ✨

We built AI SAAS Dashboard to solve one problem: operational work gets scattered across too many tools.

Now our users are:
→ 3x-ing their content output
→ Cutting production time by 70%
→ Generating copy that actually converts

The future of content isn't humans vs AI — it's humans powered by AI 🤖💙

#AIMarketing #ContentCreation #SaaSGrowth #MarketingTools #AIProductivity`,
}

export default function SocialMediaPage() {
  const [form, setForm] = useState({
    platform: 'LinkedIn',
    topic: '',
    goal: 'Brand Awareness',
    tone: 'Professional',
    hashtags: true,
    emoji: true,
  })
  const [output, setOutput] = useState('')
  const [generating, setGenerating] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const generate = async () => {
    setGenerating(true)
    setOutput('')
    await sleep(1600)
    setOutput(SAMPLE_SOCIAL[form.platform] || SAMPLE_SOCIAL['LinkedIn'])
    setGenerating(false)
  }

  return (
    <AIToolLayout
      title="Social Media Generator"
      description="Create platform-native posts that drive engagement"
      icon={FiShare2}
      color="accent"
      output={output}
      generating={generating}
      onGenerate={generate}
      onClear={() => setOutput('')}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Platform</label>
          <select className="input-field" value={form.platform} onChange={(e) => set('platform', e.target.value)}>
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Goal</label>
          <select className="input-field" value={form.goal} onChange={(e) => set('goal', e.target.value)}>
            {GOALS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Topic / Idea *</label>
        <textarea rows={3} className="input-field resize-none" value={form.topic}
          onChange={(e) => set('topic', e.target.value)}
          placeholder="What do you want to post about? Include key points, announcements, or ideas..." />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => set('hashtags', !form.hashtags)}
            className={`toggle ${form.hashtags ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
          >
            <span className={`toggle-knob ${form.hashtags ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-xs text-surface-600 dark:text-surface-400">Include hashtags</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => set('emoji', !form.emoji)}
            className={`toggle ${form.emoji ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
          >
            <span className={`toggle-knob ${form.emoji ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-xs text-surface-600 dark:text-surface-400">Include emoji</span>
        </label>
      </div>
    </AIToolLayout>
  )
}
