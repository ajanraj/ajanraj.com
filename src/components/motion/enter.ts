import type { Transition } from "framer-motion";

type EnterMotionConfig = {
  reduceMotion: boolean;
  y?: number;
  duration?: number;
  delay?: number;
};

type EnterMotion = {
  initial: false | { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: Transition;
};

const easeOut: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

export function enterMotion({
  reduceMotion,
  y = 10,
  duration = 0.28,
  delay = 0,
}: EnterMotionConfig): EnterMotion {
  if (reduceMotion) {
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, ease: easeOut, delay },
  };
}
