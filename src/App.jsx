import DesktopApp from './components/DesktopApp'
import MobileApp from './components/MobileApp'
import { useFinder } from './lib/useFinder'
import { useMediaQuery } from './lib/useMediaQuery'

export default function App() {
  const F = useFinder()
  const desktop = useMediaQuery('(min-width: 1024px)')
  return desktop ? <DesktopApp F={F} /> : <MobileApp F={F} />
}
