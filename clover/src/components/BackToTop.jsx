import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'

export default function BackToTop() {
  const [show, setShow] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button className={`to-top ${pathname === '/personalize' ? 'raised' : ''}`} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><FiArrowUp /></motion.button>
      )}
    </AnimatePresence>
  )
}
