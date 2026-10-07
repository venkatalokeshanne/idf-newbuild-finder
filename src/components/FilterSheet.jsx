import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Filters from './Filters'

export default function FilterSheet({ open, onClose, f, set, pool, count, onReset }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="scrim" className="fixed inset-0 z-[800] bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="fixed inset-x-0 bottom-0 z-[810] flex max-h-[92dvh] flex-col rounded-t-[28px] border border-b-0 border-line bg-bg2 shadow-lift"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 42 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, i) => (i.offset.y > 120 || i.velocity.y > 600) && onClose()}
            dragListener={false}
          >
            <div className="flex items-center justify-between px-5 pb-1 pt-4">
              <div className="mx-auto h-1.5 w-11 rounded-full bg-line absolute left-1/2 top-2 -translate-x-1/2" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={onClose} aria-label="Close filters" className="grid h-11 w-11 place-items-center rounded-full bg-panel2"><X size={20} /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
              <Filters f={f} set={set} pool={pool} onReset={onReset} hideHead />
            </div>
            <div className="flex gap-3 border-t border-line bg-bg2 px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
              <button onClick={onReset} className="h-12 rounded-2xl border border-line bg-panel2 px-5 font-semibold">Reset</button>
              <button onClick={onClose} className="h-12 flex-1 rounded-2xl bg-accent font-semibold text-accent-ink active:scale-[.99]">
                Show {count.toLocaleString('fr-FR')} result{count === 1 ? '' : 's'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
