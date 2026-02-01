"use client";

import { animated, useSpring } from "@react-spring/web";

/**
 * MainFooter - Bottom status bar
 * Shows version info and status
 * Minimal height design
 */
export function MainFooter() {

  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || '';
  const shortSha = commitSha.slice(0, 7);

  // Fade in animation
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 300,
    config: { duration: 500 },
  });

  return (
    <animated.footer
      style={fadeIn}
      className="flex-shrink-0 h-10 px-6 flex items-center justify-between
                 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm
                 border-t border-gray-200/50 dark:border-gray-700/50"
    >
      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          All systems operational
        </span>
      </div>

      {/* Version info */}
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        <span>© 2026 VPS Dashboard</span>
        <span className="whitespace-nowrap">v{version} {shortSha && `(${shortSha})`}</span>
      </div>
    </animated.footer>
  );
}
