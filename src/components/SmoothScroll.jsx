import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePrefs } from '../lib/prefs-context.js'
import { scroller } from '../lib/scroll.js'

export default function SmoothScroll() {
  const { motion } = usePrefs()

  useEffect(() => {
    if (!motion) return
    const instance = new Lenis({ lerp: 0.1 })
    scroller.current = instance
    let frame = requestAnimationFrame(function tick(time) {
      instance.raf(time)
      frame = requestAnimationFrame(tick)
    })
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      scroller.current = null
    }
  }, [motion])

  return null
}
