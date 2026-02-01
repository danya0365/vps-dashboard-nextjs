"use client";

import { animated, config, useSpring } from "@react-spring/web";
import { ReactNode, useState } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

/**
 * AnimatedButton - Interactive button with spring animations
 * Features:
 * - Spring bounce on click
 * - Shine effect on hover
 * - Multiple variants
 */
export function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Spring animation
  const spring = useSpring({
    scale: isPressed ? 0.95 : 1,
    y: isPressed ? 2 : 0,
    config: config.stiff,
  });

  // Variants
  const variants = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-purple-600 
      text-white 
      shadow-lg shadow-cyan-500/30
      hover:shadow-purple-500/40
    `,
    secondary: `
      bg-white dark:bg-gray-800 
      text-gray-700 dark:text-gray-200
      border border-gray-200 dark:border-gray-700
      hover:bg-gray-50 dark:hover:bg-gray-700
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-600 
      text-white 
      shadow-lg shadow-red-500/30
    `,
    ghost: `
      bg-transparent
      text-gray-600 dark:text-gray-400
      hover:bg-gray-100 dark:hover:bg-gray-800
    `,
  };

  // Sizes
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  return (
    <animated.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
      style={{
        transform: spring.scale.to((s) => `scale(${s}) translateY(${spring.y.get()}px)`),
      }}
      className={`
        relative overflow-hidden
        font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {/* Shine effect */}
      <span
        className={`
          absolute inset-0 
          bg-gradient-to-r from-transparent via-white/20 to-transparent
          -translate-x-full
          ${isHovered && !disabled ? "animate-shine" : ""}
        `}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </animated.button>
  );
}
