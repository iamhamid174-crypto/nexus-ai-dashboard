import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { AIToolLayout } from '../../components/ai-tools/AIToolLayout'
import { sleep } from '../../utils/helpers'

const STYLES = ['Photorealistic', 'Cinematic', 'Oil Painting', 'Watercolor', 'Digital Art', 'Anime', 'Sketch', '3D Render', 'Pixel Art', 'Abstract']
const MOODS = ['Dramatic', 'Ethereal', 'Vibrant', 'Minimalist', 'Dark & Moody', 'Warm & Cozy', 'Futuristic', 'Vintage']
const RATIOS = ['1:1 Square', '16:9 Landscape', '9:16 Portrait', '4:3 Standard', '3:2 Photo']
const PLATFORMS = ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Adobe Firefly', 'Leonardo AI']

const SAMPLE_PROMPT = `A cinematic photograph of a sleek AI dashboard interface floating in a dark digital realm, holographic blue and purple light streams emanating from glowing data nodes, ultra-high detail UI elements with glassmorphism effects, cyberpunk aesthetic with neon accents, volumetric fog in the background, photorealistic rendering with ray-traced reflections, 8K resolution, shot with a 24mm lens, bokeh depth of field, hyperdetailed, trending on ArtStation --ar 16:9 --v 6.1 --style raw --stylize 750 --q 2

Negative prompt: blurry, low quality, watermark, text overlay, distorted, oversaturated, amateur, stock photo, flat design, boring composition

Alternative variations:
• "...at golden hour, warm orange tones replacing the neon blue..."
• "...abstract version with geometric data visualization elements..."
• "...with a human hand reaching toward the interface, symbolizing human-AI collaboration..."`

export default function ImagePromptPage() {
  const [form, setForm] = useState({
    concept: '',
    style: 'Cinematic',
    mood: 'Dramatic',
    ratio: '16:9 Landscape',
    platform: 'Midjourney',
    details: '',
  })
  const [output, setOutput] = useState('')
  const [generating, setGenerating] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const generate = async () => {
    if (!form.concept) return
    setGenerating(true)
    setOutput('')
    await sleep(1700)
    setOutput(SAMPLE_PROMPT)
    setGenerating(false)
  }

  return (
    <AIToolLayout
      title="Image Prompt Generator"
      description="Engineer precise prompts for AI image generation tools"
      icon={FiImage}
      color="danger"
      output={output}
      generating={generating}
      onGenerate={generate}
      onClear={() => setOutput('')}
    >
      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Image Concept *</label>
        <textarea rows={3} className="input-field resize-none" value={form.concept}
          onChange={(e) => set('concept', e.target.value)}
          placeholder="Describe the image you want to create... (e.g. A futuristic AI dashboard floating in space)" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Art Style</label>
          <select className="input-field" value={form.style} onChange={(e) => set('style', e.target.value)}>
            {STYLES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Mood</label>
          <select className="input-field" value={form.mood} onChange={(e) => set('mood', e.target.value)}>
            {MOODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Aspect Ratio</label>
          <select className="input-field" value={form.ratio} onChange={(e) => set('ratio', e.target.value)}>
            {RATIOS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Target Platform</label>
          <select className="input-field" value={form.platform} onChange={(e) => set('platform', e.target.value)}>
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Additional Details</label>
        <input className="input-field" value={form.details} onChange={(e) => set('details', e.target.value)}
          placeholder="Lighting, camera angle, specific elements to include..." />
      </div>
    </AIToolLayout>
  )
}
