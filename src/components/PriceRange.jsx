import { useMemo } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { Bar, BarChart, Cell, ResponsiveContainer } from 'recharts'
import { P_MAX, P_MIN, kfmt } from '../lib/constants'

export default function PriceRange({ pool, value, onChange }) {
  const [lo, hi] = value
  const bins = useMemo(() => {
    const n = 21
    const step = (P_MAX - P_MIN) / n
    const arr = Array.from({ length: n }, (_, i) => ({ i, a: P_MIN + i * step, step, c: 0 }))
    pool.forEach((r) => {
      if (r.p1 != null) arr[Math.min(n - 1, Math.max(0, Math.floor((r.p1 - P_MIN) / step)))].c++
    })
    return arr
  }, [pool])
  return (
    <div>
      <div className="h-14" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={2}>
            <Bar dataKey="c" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {bins.map((b) => (
                <Cell key={b.i} fill={b.a + b.step > lo && b.a < hi ? 'rgb(var(--accent))' : 'rgb(var(--line))'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Slider.Root className="relative flex h-5 w-full touch-none select-none items-center" min={P_MIN} max={P_MAX} step={5000} value={value} onValueChange={onChange} minStepsBetweenThumbs={1}>
        <Slider.Track className="relative h-1 grow rounded-full bg-line">
          <Slider.Range className="absolute h-full rounded-full bg-accent" />
        </Slider.Track>
        <Slider.Thumb aria-label="Minimum price" className="block h-[18px] w-[18px] rounded-full border-[3px] border-accent bg-ink shadow" />
        <Slider.Thumb aria-label="Maximum price" className="block h-[18px] w-[18px] rounded-full border-[3px] border-accent bg-ink shadow" />
      </Slider.Root>
      <div className="mt-1.5 flex justify-between text-[13px] tabular-nums text-muted">
        <span>{kfmt(lo)}</span>
        <span>{kfmt(hi)}</span>
      </div>
    </div>
  )
}
