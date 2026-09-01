import type { Variants } from "framer-motion";

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } }
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } }
};
