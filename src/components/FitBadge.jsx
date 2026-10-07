import clsx from 'clsx'
import { FIT } from '../lib/constants'

const tone = {
  confirmed: 'bg-ok/15 text-ok',
  likely: 'bg-warn/15 text-warn',
  unverified: 'bg-mute/20 text-mute',
  near: 'bg-bad/15 text-bad',
}

export default function FitBadge({ f }) {
  return (
    <span title={FIT[f].tip} className={clsx('whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold', tone[f])}>
      {FIT[f].short}
    </span>
  )
}
