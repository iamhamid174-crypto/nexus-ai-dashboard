import { useState } from 'react'
import { FiCode } from 'react-icons/fi'
import { AIToolLayout } from '../../components/ai-tools/AIToolLayout'
import { sleep } from '../../utils/helpers'

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'PHP', 'SQL', 'Bash']
const TASKS = ['Write from scratch', 'Debug / Fix bug', 'Refactor', 'Add tests', 'Explain code', 'Optimize performance', 'Add documentation', 'Convert language']

const SAMPLE_CODE = `// Optimized debounce utility with TypeScript support
// Handles edge cases: immediate execution, cancellation, and Promise support

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
): T & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true, maxWait } = options;
  
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let result: ReturnType<T>;

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const invokeFunc = (time: number): ReturnType<T> => {
    const args = lastArgs!;
    lastArgs = null;
    lastInvokeTime = time;
    result = fn(...args) as ReturnType<T>;
    return result;
  };

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    const time = Date.now();
    lastCallTime = time;
    lastArgs = args;

    if (timeout !== null) clearTimeout(timeout);

    if (leading && shouldInvoke(time)) {
      return invokeFunc(time);
    }

    if (trailing) {
      timeout = setTimeout(() => {
        const invokeTime = Date.now();
        if (lastArgs !== null) invokeFunc(invokeTime);
        timeout = null;
      }, wait);
    }

    return result;
  } as T & { cancel: () => void; flush: () => void };

  debounced.cancel = () => {
    if (timeout !== null) clearTimeout(timeout);
    lastArgs = null;
    timeout = null;
  };

  debounced.flush = () => {
    if (lastArgs !== null) return invokeFunc(Date.now());
    return result;
  };

  return debounced;
}`

export default function CodeAssistantPage() {
  const [form, setForm] = useState({
    task: 'Write from scratch',
    language: 'TypeScript',
    description: '',
    code: '',
  })
  const [output, setOutput] = useState('')
  const [generating, setGenerating] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const generate = async () => {
    if (!form.description && !form.code) return
    setGenerating(true)
    setOutput('')
    await sleep(2000)
    setOutput(SAMPLE_CODE)
    setGenerating(false)
  }

  return (
    <AIToolLayout
      title="Code Assistant"
      description="AI-powered programming help for any language or task"
      icon={FiCode}
      color="warning"
      output={output}
      generating={generating}
      onGenerate={generate}
      onClear={() => setOutput('')}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Task</label>
          <select className="input-field" value={form.task} onChange={(e) => set('task', e.target.value)}>
            {TASKS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Language</label>
          <select className="input-field" value={form.language} onChange={(e) => set('language', e.target.value)}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Description *</label>
        <textarea rows={3} className="input-field resize-none" value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe what you want the code to do, or the bug you want fixed..." />
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Existing Code (optional)</label>
        <textarea rows={4} className="input-field resize-none font-mono text-xs" value={form.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="// Paste your code here for debugging, refactoring, or explanation..." />
      </div>
    </AIToolLayout>
  )
}
