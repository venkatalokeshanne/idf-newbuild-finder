import Fuse from 'fuse.js'
import RAW from '../data/listings.json'

const yearOf = (s) => (/(20\d\d)/.exec(s || '') || [])[1] || ''

export const DATA = RAW.map((r) => {
  const unit = r.l === 'u'
  const vat = /BRS/i.test(r.v || '') ? 'brs' : /5\.5|10%/.test(r.v || '') ? 'red' : 'std'
  const sizeRef = r.s1 || r.s2 || null
  const ppm = r.p1 && sizeRef ? Math.round(r.p1 / sizeRef) : null
  return { ...r, unit, vat, ppm, year: yearOf(r.dl), place: `${r.c}|${r.dp}` }
})

export const ALL_DEVS = Object.entries(
  DATA.reduce((m, r) => ((m[r.dev] = (m[r.dev] || 0) + 1), m), {}),
).sort((a, b) => b[1] - a[1])

export const fuse = new Fuse(DATA, { keys: ['pr', 'c', 'dev'], threshold: 0.28, ignoreLocation: true, minMatchCharLength: 2 })

export const SORTS = {
  'price-asc': ['Price, low to high', (a, b) => (a.p1 ?? 1e9) - (b.p1 ?? 1e9)],
  'price-desc': ['Price, high to low', (a, b) => (b.p1 ?? -1) - (a.p1 ?? -1)],
  'ppm-asc': ['Lowest price per m²', (a, b) => (a.ppm ?? 1e9) - (b.ppm ?? 1e9)],
  'size-desc': ['Largest size', (a, b) => (b.s2 || b.s1 || 0) - (a.s2 || a.s1 || 0)],
  name: ['Town, A to Z', (a, b) => a.c.localeCompare(b.c, 'fr') || (a.p1 ?? 1e9) - (b.p1 ?? 1e9)],
}
