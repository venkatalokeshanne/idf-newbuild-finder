import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import ListingCard from './ListingCard'
import { DEPTS } from '../lib/constants'

export default function PlacePanel({ items, fav, onFav, onMap, onClose }) {
  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 left-3 top-3 z-[600] flex w-[min(370px,calc(100%-24px))] flex-col overflow-hidden rounded-2xl border border-line bg-bg2 shadow-lift max-lg:bottom-20 max-lg:top-auto max-lg:h-[62%]"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <b className="block font-display text-[17px]">{items[0].c}</b>
              <span className="text-[13px] text-muted">
                {items.length} listing{items.length > 1 ? 's' : ''} in {DEPTS[items[0].dp]}
              </span>
            </div>
            <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-panel2 hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-2.5 overflow-auto p-3">
            {items.slice(0, 40).map((r) => (
              <ListingCard key={r.i} r={r} fav={fav.has(r.i)} onFav={onFav} onMap={onMap} />
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
