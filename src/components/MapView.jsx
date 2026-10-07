import { useEffect, useMemo, useState } from 'react'
import { Circle, CircleMarker, MapContainer, Marker, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import clsx from 'clsx'
import { LocateFixed, Maximize2 } from 'lucide-react'
import { priceColor } from '../lib/constants'

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function bubble(count, color, selected) {
  const d = Math.round(26 + Math.min(24, Math.sqrt(count) * 4))
  return L.divIcon({
    className: '',
    html: `<div class="bubble ${selected ? 'sel' : ''}" style="width:${d}px;height:${d}px;background:${color};font-size:${d > 36 ? 14 : 12}px">${count}</div>`,
    iconSize: [d, d],
    iconAnchor: [d / 2, d / 2],
  })
}

function clusterIcon(cluster) {
  const kids = cluster.getAllChildMarkers()
  const total = kids.reduce((a, m) => a + (m.options.count || 1), 0)
  const min = Math.min(...kids.map((m) => m.options.minPrice || 310000))
  const d = Math.round(34 + Math.min(34, Math.sqrt(total) * 2.4))
  return L.divIcon({
    className: 'marker-cluster-custom',
    html: `<div class="bubble" style="width:${d}px;height:${d}px;background:${priceColor(min)};font-size:14px;border-width:3px">${total}</div>`,
    iconSize: [d, d],
  })
}

function Controls({ places, focus, compact, onLocate }) {
  const map = useMap()
  useEffect(() => { if (focus) map.flyTo([focus.la, focus.lo], 13, { duration: 0.8 }) }, [focus, map])
  useEffect(() => { const t = setTimeout(() => map.invalidateSize(), 150); return () => clearTimeout(t) }, [map])
  const fit = () => places.length && map.fitBounds(L.latLngBounds(places.map((p) => [p.la, p.lo])).pad(0.12), { duration: 0.6 })
  const locate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => { const ll = [pos.coords.latitude, pos.coords.longitude]; onLocate({ ll, acc: pos.coords.accuracy }); map.flyTo(ll, 12, { duration: 0.9 }) },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }
  const btn = 'grid h-11 w-11 place-items-center rounded-full border border-line bg-panel/95 text-ink shadow-lift backdrop-blur active:scale-95 lg:h-[34px] lg:w-[34px] lg:rounded-lg'
  return (
    <div className={clsx('absolute right-3 z-[500] flex flex-col gap-2', compact ? 'top-[var(--top-h)] mt-3' : 'top-[88px]')}>
      <button onClick={fit} className={btn} aria-label="Fit map to results" title="Fit map to results"><Maximize2 size={17} /></button>
      <button onClick={locate} className={btn} aria-label="Show my location" title="Show my location"><LocateFixed size={18} /></button>
    </div>
  )
}

export default function MapView({ rows, selected, onSelect, focus, theme, compact }) {
  const [me, setMe] = useState(null)
  const places = useMemo(() => {
    const m = new Map()
    rows.forEach((r) => {
      let p = m.get(r.place)
      if (!p) m.set(r.place, (p = { key: r.place, c: r.c, dp: r.dp, la: r.la, lo: r.lo, count: 0, min: Infinity }))
      p.count++
      if (r.p1 != null && r.p1 < p.min) p.min = r.p1
    })
    return [...m.values()]
  }, [rows])

  return (
    <div className={clsx('relative isolate h-full w-full', theme === 'dark' && 'dark-tiles')}>
      <MapContainer center={[48.85, 2.45]} zoom={9} minZoom={8} zoomControl={false} className="h-full w-full" preferCanvas>
        <TileLayer url={TILE_URL} attribution={ATTR} maxZoom={19} />
        {!compact && <ZoomControl position="topright" />}
        <Controls places={places} focus={focus} compact={compact} onLocate={setMe} />
        {me && (
          <>
            <Circle center={me.ll} radius={Math.min(me.acc || 100, 2000)} pathOptions={{ color: '#60a5fa', weight: 1, fillOpacity: 0.12 }} />
            <CircleMarker center={me.ll} radius={7} pathOptions={{ color: '#fff', weight: 3, fillColor: '#3b82f6', fillOpacity: 1 }} />
          </>
        )}
        <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIcon} maxClusterRadius={46} showCoverageOnHover={false} spiderfyOnMaxZoom>
          {places.map((p) => (
            <Marker
              key={p.key + (selected === p.key ? '-s' : '')}
              position={[p.la, p.lo]}
              icon={bubble(p.count, priceColor(p.min), selected === p.key)}
              count={p.count}
              minPrice={p.min}
              eventHandlers={{ click: () => onSelect(p.key) }}
              title={`${p.c} (${p.dp}): ${p.count} listing${p.count > 1 ? 's' : ''}${p.min < Infinity ? ', from ' + Math.round(p.min / 1000) + ' k€' : ''}`}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <div className="pointer-events-none absolute left-3 top-3 z-[400] hidden items-center gap-2 rounded-xl border border-line bg-panel/90 px-3 py-1.5 text-xs text-muted lg:flex">
        Cheapest price
        <i className="h-2 w-24 rounded bg-gradient-to-r from-[#2dd4bf] via-[#fbbf24] to-[#f472b6]" />
        170 k€ to 310 k€
      </div>
    </div>
  )
}
