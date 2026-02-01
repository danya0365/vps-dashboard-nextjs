"use client";

import { VpsServer } from "@/src/application/repositories/IVpsRepository";
import Link from "next/link";
import { AnimatedButton } from "../common/AnimatedButton";
import { AnimatedCard } from "../common/AnimatedCard";
import { StatusIndicator } from "../common/StatusIndicator";

interface ServerCardProps {
  server: VpsServer;
  isLoading?: boolean;
  onStart?: (id: string) => void;
  onStop?: (id: string) => void;
  onRestart?: (id: string) => void;
  onConsole?: () => void;
}

/**
 * ServerCard - VPS Server card with usage stats
 * Features:
 * - Status indicator
 * - Resource usage bars
 * - Quick actions (start/stop/restart)
 * - Link to details page
 */
export function ServerCard({ server, isLoading, onStart, onStop, onRestart, onConsole }: ServerCardProps) {
  const formatUptime = (seconds: number): string => {
    if (seconds === 0) return "—";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      DigitalOcean: "from-blue-500 to-blue-600",
      Vultr: "from-violet-500 to-purple-600",
      Linode: "from-green-500 to-emerald-600",
      Hetzner: "from-red-500 to-rose-600",
      "AWS Lightsail": "from-amber-500 to-orange-600",
    };
    return colors[provider] || "from-gray-500 to-gray-600";
  };

  return (
    <AnimatedCard className={`p-5 flex flex-col gap-4 ${isLoading ? "opacity-70" : ""}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl z-10">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <Link href={`/servers/${server.id}`} className="flex items-center gap-3 group">
          {/* Provider badge */}
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getProviderColor(
              server.provider
            )} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
          >
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
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">
              {server.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {server.hostname}
            </p>
          </div>
        </Link>
        <StatusIndicator status={server.status} size="md" />
      </div>

      {/* Info row */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {server.location}
        </span>
        <span>{server.ipAddress}</span>
        <span className="ml-auto">⏱ {formatUptime(server.uptime)}</span>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <SpecItem label="CPU" value={`${server.specs.cpu} cores`} />
        <SpecItem label="RAM" value={`${server.specs.ram} GB`} />
        <SpecItem label="Storage" value={`${server.specs.storage} GB`} />
        <SpecItem label="OS" value={server.os.split(" ")[0]} />
      </div>

      {/* Usage bars */}
      {server.status === "running" && (
        <div className="space-y-2">
          <UsageBar label="CPU" percent={server.usage.cpuPercent} color="cyan" />
          <UsageBar label="RAM" percent={server.usage.ramPercent} color="purple" />
          <UsageBar label="Disk" percent={server.usage.storagePercent} color="pink" />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        {server.status === "stopped" && onStart && (
          <AnimatedButton
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onStart(server.id)}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Start
          </AnimatedButton>
        )}
        {server.status === "running" && (
          <>
            {onStop && (
              <AnimatedButton
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => onStop(server.id)}
                disabled={isLoading}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop
              </AnimatedButton>
            )}
            {onRestart && (
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => onRestart(server.id)}
                disabled={isLoading}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </AnimatedButton>
            )}
          </>
        )}
        {server.status === "error" && onRestart && (
          <AnimatedButton
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={() => onRestart(server.id)}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restart
          </AnimatedButton>
        )}
        
        {/* Console button */}
        {server.status === "running" && onConsole && (
          <AnimatedButton variant="ghost" size="sm" onClick={onConsole}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </AnimatedButton>
        )}

        {/* View details link */}
        <Link href={`/servers/${server.id}`}>
          <AnimatedButton variant="ghost" size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </AnimatedButton>
        </Link>
      </div>
    </AnimatedCard>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5">
        {value}
      </div>
    </div>
  );
}

function UsageBar({
  label,
  percent,
  color,
}: {
  label: string;
  percent: number;
  color: "cyan" | "purple" | "pink";
}) {
  const colors = {
    cyan: "from-cyan-400 to-cyan-500",
    purple: "from-purple-400 to-purple-500",
    pink: "from-pink-400 to-pink-500",
  };

  const getColorByPercent = (): string => {
    if (percent >= 80) return "from-red-400 to-red-500";
    if (percent >= 60) return "from-amber-400 to-amber-500";
    return colors[color];
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-8">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColorByPercent()} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-500 w-8 text-right">{percent}%</span>
    </div>
  );
}
