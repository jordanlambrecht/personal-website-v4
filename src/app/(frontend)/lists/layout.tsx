'use client' // Layouts using animation hooks/components often need to be client components

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation' // Hook to get current path

export default function ListsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() // Get the current path to use as a key for AnimatePresence

  // --- Simplify Variants ---
  const variants = {
    hidden: { opacity: 0 }, // Just fade out
    enter: { opacity: 1 }, // Just fade in
    exit: { opacity: 0 }, // Just fade out
  }
  // --- End Simplification ---

  return (
    // AnimatePresence needs a unique key on its direct child that changes
    // when the route changes. The pathname is perfect for this.
    <AnimatePresence mode="wait">
      {' '}
      {/* 'wait' ensures exit animation finishes before enter starts */}
      <motion.div
        key={pathname} // Use pathname as key
        variants={variants} // Apply animation variants
        initial="hidden" // Start hidden
        animate="enter" // Animate to enter state
        exit="exit" // Animate to exit state on route change
        // Keep transition relatively short for testing
        transition={{ type: 'linear', duration: 0.2 }} // Adjust transition timing/type
        className="w-full" // Add necessary layout styling
      >
        {children} {/* The actual page content */}
      </motion.div>
    </AnimatePresence>
  )
}
