import { useCallback, useEffect, useMemo, useState } from 'react'
import { DATA, SORTS, fuse } from './data'
import { DEFAULT_QUALITY, P_MAX, P_MIN } from './constants'
import { useLocalStorage } from './useLocalStorage'

export const INITIAL = { price: [P_MIN, P_MAX], size: 60, depts: [], devs: [], vat: [], years: [], quality: DEFAULT_QUALITY, hideDup: true, hideAgency: true, includeBrs: false, includeNoPrice: false }

export function useFinder() {
  const [theme, setTheme] = useLocalStorage('idf-theme', 'dark')
  const [favArr, setFavArr] = useLocalStorage('idf-fav', [])
  const fav = useMemo(() => new Set(favArr), [favArr])
  const [f, setF] = useState(INITIAL)
  const set = useCallback((patch) => setF((s) => ({ ...s, ...patch })), [])
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('price-asc')
  const [favOnly, setFavOnly] = useState(false)
  const [sel, setSel] = useState(null)
  const [focus, setFocus] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0f1f' : '#f3f5fc')
  }, [theme])

  const pool = useMemo(() => {
    const ids = q.trim().length > 1 ? new Set(fuse.search(q.trim()).map((x) => x.item.i)) : null
    return DATA.filter((r) => {
      if (!f.quality.includes(r.f)) return false
      if (f.depts.length && !f.depts.includes(r.dp)) return false
      if (f.devs.length && !f.devs.includes(r.dev)) return false
      if (f.vat.length && !f.vat.includes(r.vat)) return false
      if (f.years.length && !f.years.includes(r.year)) return false
      if (f.hideDup && r.dup) return false
      if (f.hideAgency && r.ag) return false
      if (!f.includeBrs && r.brs) return false
      if (!f.includeNoPrice && r.p1 == null) return false
      if (favOnly && !fav.has(r.i)) return false
      if (ids && !ids.has(r.i)) return false
      if (f.size > 60 && (r.unit ? r.s1 || 0 : r.s2 || r.s1 || 0) < f.size) return false
      return true
    })
  }, [f, q, favOnly, fav])

  const rows = useMemo(() => {
    const [lo, hi] = f.price
    return pool.filter((r) => (r.p1 == null ? lo <= P_MIN && hi >= P_MAX : r.p1 >= lo && r.p1 <= hi)).sort(SORTS[sort][1])
  }, [pool, f.price, sort])

  const stats = useMemo(() => {
    const prices = rows.map((r) => r.p1).filter(Boolean).sort((a, b) => a - b)
    return {
      count: rows.length,
      apartments: rows.reduce((a, r) => a + (r.unit ? 1 : r.un || 1), 0),
      towns: new Set(rows.map((r) => r.place)).size,
      median: prices.length ? prices[Math.floor(prices.length / 2)] : null,
    }
  }, [rows])

  const selItems = useMemo(() => (sel ? rows.filter((r) => r.place === sel) : []), [rows, sel])
  const toggleFav = useCallback((i) => {
    try { navigator.vibrate?.(8) } catch { /* not supported */ }
    setFavArr((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]))
  }, [setFavArr])
  const reset = useCallback(() => { setF(INITIAL); setQ(''); setFavOnly(false) }, [])
  const showOnMap = useCallback((r) => { setSel(r.place); setFocus({ la: r.la, lo: r.lo, t: Date.now() }) }, [])
  const activeCount =
    (f.depts.length ? 1 : 0) + (f.devs.length ? 1 : 0) + (f.vat.length ? 1 : 0) + (f.years.length ? 1 : 0) + (f.size > 60 ? 1 : 0) +
    (f.price[0] > P_MIN || f.price[1] < P_MAX ? 1 : 0) + (f.quality.length !== DEFAULT_QUALITY.length || DEFAULT_QUALITY.some((k) => !f.quality.includes(k)) ? 1 : 0) + (f.includeBrs ? 1 : 0) + (f.includeNoPrice ? 1 : 0)

  return { theme, setTheme, fav, toggleFav, f, set, q, setQ, sort, setSort, favOnly, setFavOnly, sel, setSel, focus, pool, rows, stats, selItems, reset, showOnMap, activeCount }
}
