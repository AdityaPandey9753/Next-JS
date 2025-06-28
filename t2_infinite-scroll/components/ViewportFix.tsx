'use client'
import { useEffect } from 'react'

export default function ViewportFix() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    /* 
    Purpose: Calculate 1% of the current viewport height and store it as a custom CSS variable --vh.
    window.innerHeight gives you the height excluding any browser UI that's visible (like the URL bar).
    So if the screen is 800px tall, --vh = 8px. */
    
    setVh() /* Applies the initial value when the component mounts. */
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', setVh)
    /* 
    Recalculates and updates the value of --vh when:
    The screen resizes (e.g., rotating the phone, or browser bar hides)
    The orientation changes
    */

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
    }
    /* Prevents memory leaks and double bindings if the component re-renders or is unmounted. */
  }, [])

  return null // nothing to render, just side-effect
}