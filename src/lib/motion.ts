import type { Transition } from "framer-motion";

export const springs: Record<string, Transition> = {
  // Snappy, fast settling (Great for menus, modals, tooltips)
  snappy: { type: "spring", stiffness: 400, damping: 25 },
  
  // Bouncy, playful (Great for buttons, interactive cards)
  bouncy: { type: "spring", stiffness: 300, damping: 15 },
  
  // Gentle, heavy (Great for large layout shifts, big elements entering)
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  
  // High-mass, floaty (Great for subtle hover states)
  floaty: { type: "spring", stiffness: 50, damping: 10 },
};

export const variants = {
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  
  springUp: {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: springs.bouncy,
    },
  },
  
  springPop: {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: springs.snappy,
    },
  },
};
