"use client";

interface StatusIndicatorProps {
  status: "running" | "stopped" | "restarting" | "error";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const statusConfig = {
  running: {
    color: "bg-green-500",
    ring: "ring-green-500/30",
    label: "Running",
    labelColor: "text-green-600 dark:text-green-400",
  },
  stopped: {
    color: "bg-gray-400",
    ring: "ring-gray-400/30",
    label: "Stopped",
    labelColor: "text-gray-500 dark:text-gray-400",
  },
  restarting: {
    color: "bg-amber-500",
    ring: "ring-amber-500/30",
    label: "Restarting",
    labelColor: "text-amber-600 dark:text-amber-400",
  },
  error: {
    color: "bg-red-500",
    ring: "ring-red-500/30",
    label: "Error",
    labelColor: "text-red-600 dark:text-red-400",
  },
};

const sizeConfig = {
  sm: { dot: "w-2 h-2", ring: "ring-2", text: "text-xs" },
  md: { dot: "w-3 h-3", ring: "ring-4", text: "text-sm" },
  lg: { dot: "w-4 h-4", ring: "ring-4", text: "text-base" },
};

/**
 * StatusIndicator - Animated status dot
 * Pulsing animation for running/restarting states
 */
export function StatusIndicator({
  status,
  size = "md",
  showLabel = false,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const shouldPulse = status === "running" || status === "restarting";

  return (
    <div className="flex items-center gap-2">
      <span className={`relative flex ${sizeStyles.dot}`}>
        {/* Pulse ring */}
        {shouldPulse && (
          <span
            className={`
              absolute inset-0 rounded-full ${config.color} 
              animate-ping opacity-75
            `}
          />
        )}
        {/* Solid dot */}
        <span
          className={`
            relative inline-flex rounded-full ${sizeStyles.dot} ${config.color}
            ${sizeStyles.ring} ${config.ring}
          `}
        />
      </span>
      
      {showLabel && (
        <span className={`font-medium ${sizeStyles.text} ${config.labelColor}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
