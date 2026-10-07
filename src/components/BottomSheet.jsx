import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useDragControls, useMotionValue } from 'framer-motion'

export const SNAPS = ['peek', 'half', 'full']
const HEADER_H = 76

export default function BottomSheet({ snap, setSnap, header, children }) {
  const wrap = useRef(null)
  const [H, setH] = useState(640)
  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setH(Math.max(300, e.contentRect.height)))
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])
  const vis = { peek: 148, half: Math.round(H * 0.55), full: H }
  const y = useMotionValue(H - vis[snap])
  const controls = useDragControls()
  useEffect(() => {
    const c = animate(y, H - vis[snap], { type: 'spring', stiffness: 420, damping: 40 })
    return () => c.stop()
  }, [snap, H]) // eslint-disable-line react-hooks/exhaustive-deps

  const settle = (_, info) => {
    const target = y.get() + info.velocity.y * 0.18
    const best = SNAPS.reduce((b, s) => (Math.abs(H - vis[s] - target) < Math.abs(H - vis[b] - target) ? s : b), 'peek')
    setSnap(best)
    animate(y, H - vis[best], { type: 'spring', stiffness: 420, damping: 40 })
  }
  const cycle = () => setSnap(SNAPS[(SNAPS.indexOf(snap) + 1) % SNAPS.length])

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-x-0 z-40" style={{ top: 'var(--top-h)', bottom: 'var(--nav-h)' }}>
      <motion.section
        className="pointer-events-auto absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[28px] border border-b-0 border-line bg-bg2/95 shadow-[0_-12px_40px_rgba(0,0,0,.35)] backdrop-blur-xl"
        style={{ height: H, y }}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: H - vis.peek }}
        dragElastic={0.05}
        onDragEnd={settle}
        aria-label="Results"
      >
        <div onPointerDown={(e) => controls.start(e)} onClick={cycle} className="touch-none select-none px-4 pb-2 pt-2.5" style={{ height: HEADER_H }}>
          <div className="mx-auto mb-2.5 h-1.5 w-11 rounded-full bg-line" aria-hidden="true" />
          {header}
        </div>
        <div className="overflow-y-auto overscroll-contain px-3" style={{ height: H - HEADER_H, paddingBottom: H - vis[snap] + 24 }}>
          {children}
        </div>
      </motion.section>
    </div>
  )
}
