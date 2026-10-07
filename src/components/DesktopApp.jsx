import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Building2, Heart, Info, LayoutGrid, Map as MapIcon, MapPin, Moon, Search, Sun, Table2 } from 'lucide-react'
import Filters from './Filters'
import ListingCard from './ListingCard'
import ListingTable from './ListingTable'
import MapView from './MapView'
import PlacePanel from './PlacePanel'
import { SORTS } from '../lib/data'
import { kfmt } from '../lib/constants'

const VIEWS = [['split', 'List and map', MapIcon], ['cards', 'Cards', LayoutGrid], ['table', 'Table', Table2], ['map', 'Map', MapPin]]

export default function DesktopApp({ F }) {
  const { f, set, rows, stats, sel, setSel, fav, theme, setTheme } = F
  const [view, setView] = useState('split')
  const [shown, setShown] = useState(36)
  useEffect(() => setShown(36), [rows])
  const onMap = (r) => { F.showOnMap(r); setView((v) => (v === 'cards' || v === 'table' ? 'split' : v)) }

  const list = (
    <div className={clsx('min-w-0 overflow-auto px-4 pb-8 pt-4', view === 'split' ? 'w-[min(520px,42vw)] flex-none' : 'flex-1')}>
      {rows.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <h3 className="text-lg font-semibold">No programmes match these filters</h3>
          <p className="mx-auto my-2 max-w-[40ch] text-muted">Raise the maximum budget, lower the minimum size, or include "Needs a call" in the match filter.</p>
          <button onClick={F.reset} className="mt-3 h-9 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">Reset filters</button>
        </div>
      ) : view === 'table' ? (
        <ListingTable rows={rows} fav={fav} onFav={F.toggleFav} onMap={onMap} />
      ) : (
        <div className={clsx('grid gap-3', view === 'cards' ? 'grid-cols-[repeat(auto-fill,minmax(330px,1fr))]' : 'grid-cols-1')}>
          {rows.slice(0, shown).map((r) => <ListingCard key={r.i} r={r} fav={fav.has(r.i)} onFav={F.toggleFav} onMap={onMap} active={sel === r.place} />)}
          {rows.length > shown && <button onClick={() => setShown(shown + 36)} className="col-span-full mx-auto h-9 rounded-xl border border-line bg-panel2 px-5 text-sm font-semibold hover:border-accent">Show more ({rows.length - shown} left)</button>}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-5 border-b border-line bg-bg2 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br from-accent to-[#2dd4bf] text-accent-ink"><Building2 size={21} /></span>
          <div><h1 className="text-[19px] font-semibold leading-tight">Île-de-France new-build finder</h1><p className="m-0 text-[13px] text-muted">3 rooms, 60 m² or more, under 310,000 €</p></div>
        </div>
        <label className="ml-auto flex h-[42px] max-w-[520px] flex-1 items-center gap-2.5 rounded-xl border border-line bg-panel2 px-3.5 text-muted focus-within:border-accent">
          <Search size={17} />
          <input type="search" value={F.q} onChange={(e) => F.setQ(e.target.value)} placeholder="Search a town, programme or developer" aria-label="Search" className="h-full flex-1 bg-transparent text-ink outline-none" />
        </label>
        <button onClick={() => F.setFavOnly(!F.favOnly)} aria-pressed={F.favOnly} className={clsx('inline-flex h-9 items-center gap-1.5 rounded-xl border bg-panel2 px-3.5 text-[13.5px] font-semibold', F.favOnly ? 'border-bad text-bad' : 'border-line')}>
          <Heart size={16} fill={F.favOnly ? 'currentColor' : 'none'} />Saved {fav.size ? `(${fav.size})` : ''}
        </button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Switch theme" className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-panel2">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
      </header>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line px-5 py-2.5 text-[13.5px]">
        {[[stats.count.toLocaleString('fr-FR'), 'programmes and apartment lines'], [stats.apartments.toLocaleString('fr-FR'), 'apartments counted'], [stats.towns, 'towns'], [stats.median ? kfmt(stats.median) : '-', 'median price']].map(([n, l]) => (
          <div key={l}><b className="font-display text-lg tabular-nums">{n}</b> <span className="text-muted">{l}</span></div>
        ))}
        <div className="flex-1" />
        <label className="flex items-center gap-2"><span className="text-muted">Sort</span>
          <select value={F.sort} onChange={(e) => F.setSort(e.target.value)} className="h-[34px] rounded-xl border border-line bg-panel2 px-2.5">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select>
        </label>
        <div role="tablist" aria-label="View" className="inline-flex gap-0.5 rounded-xl border border-line bg-panel2 p-[3px]">
          {VIEWS.map(([k, label, Ic]) => (
            <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)} className={clsx('inline-flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium', view === k ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink')}><Ic size={16} />{label}</button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[296px] flex-none overflow-auto border-r border-line bg-bg2 px-[18px] pb-10 pt-4"><Filters f={f} set={set} pool={F.pool} onReset={F.reset} /></aside>
        {view !== 'map' && list}
        {(view === 'split' || view === 'map') && (
          <div className="relative min-w-0 flex-1 border-l border-line">
            <MapView rows={rows} selected={sel} onSelect={(k) => setSel(sel === k ? null : k)} focus={F.focus} theme={theme} />
            <PlacePanel items={F.selItems} fav={fav} onFav={F.toggleFav} onMap={onMap} onClose={() => setSel(null)} />
          </div>
        )}
      </div>

      <footer className="flex items-start gap-2 border-t border-line bg-bg2 px-5 py-2.5 text-xs text-muted">
        <Info size={15} className="mt-px flex-none" />
        <p className="m-0 max-w-[140ch]">Collected on 6 October 2026 from developer websites and the SeLoger Neuf developer feed. Prices and availability change daily: confirm size, price and VAT with the developer. Reduced VAT (5.5% or 10%) and BRS need income or resale conditions. Floor plans were not downloaded.</p>
      </footer>
    </div>
  )
}
