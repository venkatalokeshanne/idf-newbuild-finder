import { useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import PriceRange from './PriceRange'
import { ALL_DEVS } from '../lib/data'
import { DEPTS, FIT, SHORT_DEPTS, VATS } from '../lib/constants'

function Chip({ on, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      title={title}
      className={clsx(
        'h-10 rounded-full border px-3.5 text-sm transition-colors lg:h-[30px] lg:px-3 lg:text-[13px]',
        on ? 'border-accent bg-accent/20 text-ink' : 'border-line bg-panel2 text-muted hover:border-accent hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

function Section({ title, aside, children }) {
  return (
    <section className="border-b border-line py-4">
      <div className="mb-2.5 flex items-baseline justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        {aside}
      </div>
      {children}
    </section>
  )
}

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export default function Filters({ f, set, pool, onReset, hideHead }) {
  const [devOpen, setDevOpen] = useState(false)
  const [devQ, setDevQ] = useState('')
  const devs = ALL_DEVS.filter(([d]) => d.toLowerCase().includes(devQ.toLowerCase()))
  return (
    <div>
      {!hideHead && (
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-[17px] font-semibold">Filters</h2>
          <button onClick={onReset} className="text-[13px] text-accent hover:underline">Reset all</button>
        </div>
      )}

      <Section title="Budget">
        <PriceRange pool={pool} value={f.price} onChange={(price) => set({ price })} />
      </Section>

      <Section title="Minimum size" aside={<b className="text-sm tabular-nums">{f.size} m²</b>}>
        <Slider.Root className="relative flex h-5 w-full touch-none select-none items-center" min={60} max={80} step={1} value={[f.size]} onValueChange={([v]) => set({ size: v })}>
          <Slider.Track className="relative h-1 grow rounded-full bg-line">
            <Slider.Range className="absolute h-full rounded-full bg-accent" />
          </Slider.Track>
          <Slider.Thumb aria-label="Minimum size" className="block h-[18px] w-[18px] rounded-full border-[3px] border-accent bg-ink shadow" />
        </Slider.Root>
      </Section>

      <Section title="Département">
        <div className="flex flex-wrap gap-[7px]">
          {Object.entries(DEPTS).map(([d, n]) => (
            <Chip key={d} on={f.depts.includes(d)} onClick={() => set({ depts: toggle(f.depts, d) })} title={n}>
              {d} {SHORT_DEPTS[d]}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="How sure is the match">
        <div className="flex flex-wrap gap-[7px]">
          {Object.keys(FIT).map((k) => (
            <Chip key={k} on={f.quality.includes(k)} onClick={() => set({ quality: toggle(f.quality, k) })} title={FIT[k].tip}>
              {FIT[k].label}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="VAT type">
        <div className="flex flex-wrap gap-[7px]">
          {Object.entries(VATS).map(([k, l]) => (
            <Chip key={k} on={f.vat.includes(k)} onClick={() => set({ vat: toggle(f.vat, k) })}>{l}</Chip>
          ))}
        </div>
      </Section>

      <Section title="Delivery year">
        <div className="flex flex-wrap gap-[7px]">
          {['2026', '2027', '2028', '2029'].map((y) => (
            <Chip key={y} on={f.years.includes(y)} onClick={() => set({ years: toggle(f.years, y) })}>{y}</Chip>
          ))}
        </div>
      </Section>

      <Section
        title="Developers"
        aside={<button onClick={() => set({ devs: [] })} className="text-[13px] text-accent hover:underline">{f.devs.length ? `${f.devs.length} selected, clear` : 'All'}</button>}
      >
        <button onClick={() => setDevOpen(!devOpen)} aria-expanded={devOpen} className="flex h-11 w-full items-center justify-between rounded-xl border border-line bg-panel2 px-3 lg:h-[38px]">
          Choose developers
          <ChevronDown size={16} className={clsx(devOpen && 'rotate-180')} />
        </button>
        {devOpen && (
          <div className="mt-2 rounded-xl border border-line bg-panel p-2">
            <input value={devQ} onChange={(e) => setDevQ(e.target.value)} placeholder="Find a developer" aria-label="Find a developer" className="mb-1.5 h-[34px] w-full rounded-lg border border-line bg-panel2 px-2.5 outline-none focus:border-accent" />
            <div className="max-h-56 overflow-auto">
              {devs.map(([d, n]) => (
                <label key={d} className="flex cursor-pointer items-center gap-2 px-1 py-1.5 text-[13.5px]">
                  <input type="checkbox" className="accent-[rgb(var(--accent))]" checked={f.devs.includes(d)} onChange={() => set({ devs: toggle(f.devs, d) })} />
                  <span className="min-w-0 flex-1 truncate">{d}</span>
                  <em className="text-xs not-italic text-muted">{n}</em>
                </label>
              ))}
            </div>
          </div>
        )}
      </Section>

      <label className="flex cursor-pointer items-start gap-3 pt-4 text-sm text-muted">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]" checked={f.hideDup} onChange={(e) => set({ hideDup: e.target.checked })} />
        Hide portal rows that repeat a developer site
      </label>
      <label className="flex cursor-pointer items-start gap-3 pt-3 text-sm text-muted">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]" checked={f.hideAgency} onChange={(e) => set({ hideAgency: e.target.checked })} />
        Hide sales agencies (only show real developers)
      </label>
    </div>
  )
}
