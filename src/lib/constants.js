export const DEPTS = {
  '75': 'Paris', '77': 'Seine-et-Marne', '78': 'Yvelines', '91': 'Essonne',
  '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne', '95': "Val-d'Oise",
}

export const SHORT_DEPTS = {
  '75': 'Paris', '77': 'Seine-et-Marne', '78': 'Yvelines', '91': 'Essonne',
  '92': 'Hauts-de-Seine', '93': 'Seine-St-Denis', '94': 'Val-de-Marne', '95': "Val-d'Oise",
}

export const FIT = {
  confirmed: { label: 'Confirmed apartments', short: 'Confirmed', tip: 'Exact apartments read on the developer site or feed: 3 rooms, 60 m² or more, under €310,000.' },
  likely: { label: 'Likely match', short: 'Likely', tip: 'The developer shows a size range and a "from" price. A 60 m²+ unit probably exists under €310,000 but is not listed.' },
  unverified: { label: 'Needs a call', short: 'Needs a call', tip: 'Only a "from" price, or no price. Ask an adviser for 3-room sizes.' },
  near: { label: 'Near miss', short: 'Near miss', tip: 'Just outside your filters (for example 59 m² or a little over budget).' },
}

export const VATS = { std: 'Standard 20%', red: 'Reduced VAT', brs: 'BRS' }

export const P_MIN = 100000
export const P_MAX = 310000
export const DEFAULT_QUALITY = ['confirmed', 'likely']

export const eur = (n) => (n == null ? '' : Math.round(n).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' €')
export const kfmt = (n) => (n == null ? '' : Math.round(n / 1000) + ' k€')

const lerp = (a, b, t) => Math.round(a + (b - a) * t)
const STOPS = [[170000, [45, 212, 191]], [240000, [251, 191, 36]], [310000, [244, 114, 182]]]
export function priceColor(p) {
  const v = Math.min(310000, Math.max(170000, p ?? 310000))
  const [a, b] = v <= STOPS[1][0] ? [STOPS[0], STOPS[1]] : [STOPS[1], STOPS[2]]
  const t = (v - a[0]) / (b[0] - a[0])
  return `rgb(${lerp(a[1][0], b[1][0], t)},${lerp(a[1][1], b[1][1], t)},${lerp(a[1][2], b[1][2], t)})`
}

export function priceText(r) {
  if (r.p1 == null) return { main: 'Price on request', sub: '' }
  if (r.unit) return { main: eur(r.p1), sub: r.p20 && r.p20 > r.p1 ? `at 20% VAT ${eur(r.p20)}` : '' }
  if (r.p2 && r.p2 !== r.p1) return { main: `${kfmt(r.p1)} to ${kfmt(r.p2)}`, sub: `cheapest ${eur(r.p1)}` }
  return { main: `from ${eur(r.p1)}`, sub: '' }
}

export function sizeText(r) {
  if (!r.s1 && !r.s2) return 'size not published'
  if (r.s1 && r.s2 && Math.round(r.s1) !== Math.round(r.s2)) return `${Math.round(r.s1)} to ${Math.round(r.s2)} m²`
  const s = r.s1 || r.s2
  return `${(Math.round(s * 10) / 10).toString().replace('.', ',')} m²`
}
