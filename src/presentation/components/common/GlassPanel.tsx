"use client";

import { animated, useSpring } from "@react-spring/web";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * GlassPanel - Glassmorphism container with fade-in animation
 */
export function GlassPanel({ children, className = "", delay = 0 }: GlassPanelProps) {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay,
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.div
      style={fadeIn}
      className={`
        bg-white/60 dark:bg-gray-800/60
        backdrop-blur-xl
        border border-gray-200/50 dark:border-gray-700/50
        rounded-2xl
        shadow-xl shadow-gray-500/5
        ${className}
      `}
    >
      {children}
    </animated.div>
  );
}
