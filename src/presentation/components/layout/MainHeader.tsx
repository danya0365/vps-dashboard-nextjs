"use client";

import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileMenuButton, MobileSidebar } from "./MobileSidebar";
import { ThemeToggle } from "./ThemeToggle";

/**
 * MainHeader - Top navigation bar
 * Features: Logo, navigation, theme toggle, mobile menu
 * Glassmorphism design with animations
 */
export function MainHeader() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Fade in animation
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 200, friction: 20 },
  });

  return (
    <>
      <animated.header
        style={fadeIn}
        className="flex-shrink-0 h-16 px-6 flex items-center justify-between
                   bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
                   border-b border-gray-200/50 dark:border-gray-700/50
                   shadow-sm"
      >
        {/* Left side: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          <MobileMenuButton onClick={() => setSidebarOpen(true)} />
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Server icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 
                            flex items-center justify-center shadow-lg shadow-cyan-500/30
                            group-hover:shadow-purple-500/40 transition-shadow duration-300">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                VPS Dashboard
              </span>
              <span className="text-[10px] text-gray-400 -mt-0.5">
                Server Management
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem href="/" label="Dashboard" isActive={pathname === "/"} />
          <NavItem href="/servers" label="Servers" isActive={pathname === "/servers" || pathname.startsWith("/servers/")} />
          <NavItem href="/analytics" label="Analytics" isActive={pathname === "/analytics"} />
          <NavItem href="/settings" label="Settings" isActive={pathname === "/settings"} />
        </nav>

        {/* Right side: Theme toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </animated.header>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

function NavItem({ href, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-600 dark:text-cyan-400"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
    >
      {label}
    </Link>
  );
}
