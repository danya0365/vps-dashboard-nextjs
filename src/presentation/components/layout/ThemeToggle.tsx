"use client";

import { animated, useSpring } from "@react-spring/web";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * ThemeToggle - Animated theme toggle button
 * Switches between light/dark modes with smooth animations
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  // Spring animation for button
  const [buttonSpring, buttonApi] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    config: { tension: 300, friction: 10 },
  }));

  const handleClick = () => {
    buttonApi.start({
      scale: 0.9,
      rotate: isDark ? -180 : 180,
      onRest: () => {
        buttonApi.start({ scale: 1 });
      },
    });
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <animated.button
      style={{
        transform: buttonSpring.scale.to(
          (s) => `scale(${s}) rotate(${buttonSpring.rotate.get()}deg)`
        ),
      }}
      onClick={handleClick}
      className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 
                 border border-gray-200 dark:border-gray-600 
                 flex items-center justify-center
                 hover:shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-purple-500/20
                 transition-shadow duration-300 cursor-pointer"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun icon */}
      <svg
        className={`absolute w-5 h-5 text-amber-500 transition-all duration-300 ${
          isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon icon */}
      <svg
        className={`absolute w-5 h-5 text-purple-400 transition-all duration-300 ${
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </animated.button>
  );
}
