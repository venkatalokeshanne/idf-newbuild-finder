import { useState } from 'react'
import clsx from 'clsx'
import { ArrowLeft, Heart, List, Map as MapIcon, Moon, Search, SlidersHorizontal, Sun } from 'lucide-react'
import BottomSheet from './BottomSheet'
import FilterSheet from './FilterSheet'
import ListingCard from './ListingCard'
import MapView from './MapView'
import { DATA, SORTS } from '../lib/data'
import { DEFAULT_QUALITY, DEPTS, SHORT_DEPTS, kfmt } from '../lib/constants'

function Pill({ on, onClick, children }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={clsx('h-9 flex-none whitespace-nowrap rounded-full border px-3.5 text-[13.5px] font-medium shadow-sm backdrop-blur active:scale-95', on ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-panel/90 text-ink')}>
      {children}
    </button>
  )
}

function Cards({ rows, F, active, shown, setShown, onMap }) {
  return (
    <div className="grid gap-3 pb-4">
      {rows.slice(0, shown).map((r) => (
        <ListingCard key={r.i} r={r} fav={F.fav.has(r.i)} onFav={F.toggleFav} onMap={onMap} active={active === r.place} />
      ))}
      {rows.length > shown && (
        <button onClick={() => setShown(shown + 30)} className="mx-auto h-11 rounded-2xl border border-line bg-panel2 px-6 font-semibold">Show more ({rows.length - shown} left)</button>
      )}
      {rows.length === 0 && (
        <div className="px-4 py-14 text-center">
          <h3 className="text-lg font-semibold">Nothing matches these filters</h3>
          <p className="mx-auto my-2 max-w-[32ch] text-muted">Raise the budget, lower the minimum size, or include "Size unknown" in the match filter.</p>
          <button onClick={F.reset} className="mt-2 h-11 rounded-2xl bg-accent px-6 font-semibold text-accent-ink">Reset filters</button>
        </div>
      )}
    </div>
  )
}

export default function MobileApp({ F }) {
  const [tab, setTab] = useState('explore')
  const [snap, setSnap] = useState('peek')
  const [filters, setFilters] = useState(false)
  const [shown, setShown] = useState(30)
  const { f, set, rows, stats, sel, setSel, fav, theme, setTheme } = F
  const saved = DATA.filter((r) => fav.has(r.i))
  const onMap = (r) => { F.showOnMap(r); setTab('explore'); setSnap('half') }
  const confirmedOnly = f.quality.length === 1 && f.quality[0] === 'confirmed'
  const toggleDept = (d) => set({ depts: f.depts.includes(d) ? f.depts.filter((x) => x !== d) : [...f.depts, d] })

  const topBar = (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[600] pt-[env(safe-area-inset-top)]">
      <div className={clsx('px-3 pt-3', tab !== 'explore' && 'bg-bg/90 pb-1 backdrop-blur-xl')}>
        <div className="pointer-events-auto flex items-center gap-2">
          <label className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-line bg-panel/95 px-3.5 text-muted shadow-lift backdrop-blur focus-within:border-accent">
            <Search size={18} />
            <input type="search" value={F.q} onChange={(e) => F.setQ(e.target.value)} placeholder="Town, programme or developer" aria-label="Search" className="h-full min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted" />
          </label>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Switch theme" className="grid h-12 w-12 flex-none place-items-center rounded-2xl border border-line bg-panel/95 shadow-lift backdrop-blur active:scale-95">
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
        <div className="scroll-x pointer-events-auto -mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1">
          <Pill on={F.activeCount > 0 && f.price[1] < 310000} onClick={() => setFilters(true)}>Up to {kfmt(f.price[1])}</Pill>
          <Pill on={confirmedOnly} onClick={() => set({ quality: confirmedOnly ? DEFAULT_QUALITY : ['confirmed'] })}>Confirmed only</Pill>
          {Object.keys(DEPTS).map((d) => <Pill key={d} on={f.depts.includes(d)} onClick={() => toggleDept(d)}>{d} {SHORT_DEPTS[d]}</Pill>)}
        </div>
      </div>
    </div>
  )

  const sheetHeader = sel && F.selItems.length ? (
    <div className="flex items-center gap-3">
      <button onClick={(e) => { e.stopPropagation(); setSel(null) }} onPointerDown={(e) => e.stopPropagation()} aria-label="Back to all results" className="grid h-10 w-10 flex-none place-items-center rounded-full bg-panel2"><ArrowLeft size={19} /></button>
      <div className="min-w-0">
        <b className="block truncate font-display text-lg leading-tight">{F.selItems[0].c}</b>
        <span className="text-[13px] text-muted">{F.selItems.length} listing{F.selItems.length > 1 ? 's' : ''} in {DEPTS[F.selItems[0].dp]}</span>
      </div>
    </div>
  ) : (
    <div className="flex items-baseline justify-between gap-3">
      <div className="min-w-0"><b className="font-display text-xl tabular-nums">{stats.count.toLocaleString('fr-FR')}</b> <span className="text-sm text-muted">programmes in {stats.towns} towns</span></div>
      {stats.median && <span className="flex-none text-[13px] text-muted">median {kfmt(stats.median)}</span>}
    </div>
  )

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg">
      {tab === 'explore' && (
        <>
          <div className="absolute inset-0"><MapView rows={rows} selected={sel} onSelect={(k) => { setSel(sel === k ? null : k); if (sel !== k) setSnap('half') }} focus={F.focus} theme={theme} compact /></div>
          {topBar}
          <BottomSheet snap={snap} setSnap={setSnap} header={sheetHeader}>
            <Cards rows={sel ? F.selItems : rows} F={F} active={sel} shown={shown} setShown={setShown} onMap={onMap} />
          </BottomSheet>
        </>
      )}

      {tab === 'list' && (
        <>
          {topBar}
          <div className="absolute inset-0 overflow-y-auto overscroll-contain px-3" style={{ paddingTop: 'calc(var(--top-h) + 4px)', paddingBottom: 'calc(var(--nav-h) + 16px)' }}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm text-muted"><b className="font-display text-lg text-ink tabular-nums">{stats.count.toLocaleString('fr-FR')}</b> programmes, {stats.apartments.toLocaleString('fr-FR')} apartments</span>
              <select value={F.sort} onChange={(e) => F.setSort(e.target.value)} aria-label="Sort" className="h-10 rounded-xl border border-line bg-panel2 px-2.5 text-sm">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}
              </select>
            </div>
            <Cards rows={rows} F={F} active={null} shown={shown} setShown={setShown} onMap={onMap} />
            <p className="px-2 pb-4 text-xs text-muted">Collected on 6 October 2026 from developer websites and the SeLoger Neuf developer feed. Confirm size, price and VAT with the developer. Reduced VAT and BRS need income or resale conditions.</p>
          </div>
        </>
      )}

      {tab === 'saved' && (
        <div className="absolute inset-0 overflow-y-auto overscroll-contain px-3" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)', paddingBottom: 'calc(var(--nav-h) + 16px)' }}>
          <h1 className="px-1 pb-3 text-2xl font-semibold">Saved</h1>
          {saved.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <Heart size={34} className="mx-auto text-muted" />
              <p className="mx-auto mt-3 max-w-[30ch] text-muted">Tap the heart on a listing to keep it here, even when filters change.</p>
              <button onClick={() => setTab('list')} className="mt-4 h-11 rounded-2xl bg-accent px-6 font-semibold text-accent-ink">Browse listings</button>
            </div>
          ) : (
            <Cards rows={saved} F={F} active={null} shown={saved.length} setShown={() => {}} onMap={onMap} />
          )}
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[700] border-t border-line bg-bg2/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl" aria-label="Main">
        <ul className="m-0 grid h-16 list-none grid-cols-4 p-0">
          {[
            ['explore', 'Explore', MapIcon, () => setTab('explore'), 0],
            ['list', 'List', List, () => setTab('list'), 0],
            ['saved', 'Saved', Heart, () => setTab('saved'), fav.size],
            ['filters', 'Filters', SlidersHorizontal, () => setFilters(true), F.activeCount],
          ].map(([k, label, Ic, go, n]) => (
            <li key={k}>
              <button onClick={go} aria-current={tab === k ? 'page' : undefined} className={clsx('relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11.5px] font-medium', tab === k ? 'text-accent' : 'text-muted')}>
                <span className={clsx('relative grid h-7 w-12 place-items-center rounded-full transition-colors', tab === k && 'bg-accent/15')}>
                  <Ic size={21} fill={k === 'saved' && tab === 'saved' ? 'currentColor' : 'none'} />
                  {n > 0 && <i className="absolute -right-0.5 -top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-bad px-1 text-[10px] font-bold not-italic text-white">{n}</i>}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <FilterSheet open={filters} onClose={() => setFilters(false)} f={f} set={set} pool={F.pool} count={stats.count} onReset={F.reset} />
    </div>
  )
}
