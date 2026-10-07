import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Heart, ExternalLink, MapPin } from 'lucide-react'
import FitBadge from './FitBadge'
import { VATS, devLink, priceText, sizeText } from '../lib/constants'

const bar = { confirmed: 'border-l-ok', likely: 'border-l-warn', unverified: 'border-l-mute', near: 'border-l-bad' }

function Chip({ children, className }) {
  return <span className={clsx('rounded-lg border border-line bg-panel2 px-2.5 py-0.5 text-[12.5px]', className)}>{children}</span>
}

export default function ListingCard({ r, fav, onFav, onMap, active }) {
  const [open, setOpen] = useState(false)
  const pt = priceText(r)
  const dl = devLink(r)
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={clsx(
        'min-w-0 rounded-2xl border border-l-[3px] border-line bg-panel p-4',
        bar[r.f],
        active && 'ring-1 ring-accent border-accent',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[13px] text-muted">{r.dev}</span>
        <div className="flex items-center gap-1">
          <FitBadge f={r.f} />
          <button
            onClick={() => onFav(r.i)}
            aria-pressed={fav}
            aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
            className={clsx('grid h-8 w-8 place-items-center rounded-lg hover:bg-panel2', fav ? 'text-bad' : 'text-muted')}
          >
            <Heart size={17} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <h3 className="mt-1.5 text-lg font-semibold leading-tight">{r.pr}</h3>
      <p className="text-sm text-muted">
        {r.c} ({r.dp}){r.lot ? `, lot ${r.lot}` : ''}
      </p>

      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5">
        <b className="font-display text-2xl tracking-tight tabular-nums">{pt.main}</b>
        {pt.sub && <small className="text-[12.5px] text-muted">{pt.sub}</small>}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Chip>{sizeText(r)}</Chip>
        {r.ppm && <Chip>{r.unit ? '' : '≈ '}{r.ppm.toLocaleString('fr-FR')} €/m²</Chip>}
        {r.un && <Chip>{r.un} {r.un > 1 ? 'apartments' : 'apartment'}</Chip>}
        <Chip className={clsx(r.vat === 'red' && 'border-warn/60', r.vat === 'brs' && 'border-accent/70')}>
          {r.v ? r.v.replace('TTC (portal)', 'Portal price') : VATS[r.vat]}
        </Chip>
        {r.dl && <Chip>{r.dl.slice(0, 24)}</Chip>}
        {r.fl && <Chip>{r.fl}</Chip>}
        {r.o && <Chip>{r.o.slice(0, 40)}</Chip>}
      </div>

      {r.n && (
        <div>
          <button onClick={() => setOpen(!open)} aria-expanded={open} className="pt-2 text-[13px] text-accent hover:underline">
            {open ? 'Hide details' : 'Show details'}
          </button>
          {open && <p className="mt-1.5 text-[13px] text-muted">{r.n}</p>}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={dl.href}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx('inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-[13.5px] font-semibold lg:h-9', dl.direct ? 'bg-accent text-accent-ink hover:brightness-110' : 'border border-accent text-accent')}
        >
          <ExternalLink size={15} />
          {dl.label}
        </a>
        <button
          onClick={() => onMap(r)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line bg-panel2 px-3.5 text-[13.5px] font-semibold hover:border-accent lg:h-9"
        >
          <MapPin size={15} />
          Show on map
        </button>
        {r.s === 'p' && r.u && (
          <a href={r.u} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center px-1 text-[12.5px] text-muted underline hover:text-ink lg:h-9">
            SeLoger listing
          </a>
        )}
      </div>
    </motion.article>
  )
}
