"use client";

import { animated, config, useSpring } from "@react-spring/web";
import { ReactNode, useCallback, useState } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  clickScale?: number;
}

/**
 * AnimatedCard - Interactive card with spring animations
 * Features:
 * - Scale effect on hover
 * - Press effect on click
 * - 3D tilt effect on mouse move
 * - Glassmorphism background
 */
export function AnimatedCard({
  children,
  className = "",
  onClick,
  hoverScale = 1.02,
  clickScale = 0.98,
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Main spring for scale and shadow
  const springProps = useSpring({
    scale: isPressed ? clickScale : isHovered ? hoverScale : 1,
    shadow: isHovered ? 20 : 8,
    config: config.wobbly,
  });

  // Tilt spring for 3D effect
  const [tiltSpring, tiltApi] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHovered) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      tiltApi.start({
        rotateX: (y - 0.5) * -10,
        rotateY: (x - 0.5) * 10,
      });
    },
    [isHovered, tiltApi]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    tiltApi.start({ rotateX: 0, rotateY: 0 });
  }, [tiltApi]);

  return (
    <animated.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      style={{
        transform: springProps.scale.to(
          (s) =>
            `perspective(1000px) scale(${s}) rotateX(${tiltSpring.rotateX.get()}deg) rotateY(${tiltSpring.rotateY.get()}deg)`
        ),
        boxShadow: springProps.shadow.to(
          (s) =>
            `0 ${s}px ${s * 2}px -${s / 2}px rgba(0, 0, 0, 0.1), 0 ${s / 2}px ${s}px -${s / 2}px rgba(0, 0, 0, 0.06)`
        ),
      }}
      className={`
        bg-white/80 dark:bg-gray-800/80 
        backdrop-blur-xl
        border border-gray-200/50 dark:border-gray-700/50
        rounded-2xl
        cursor-pointer
        transition-colors duration-300
        ${className}
      `}
    >
      {children}
    </animated.div>
  );
}
