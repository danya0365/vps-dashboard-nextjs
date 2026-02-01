"use client";

import { VpsServer } from "@/src/application/repositories/IVpsRepository";
import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { AnimatedButton } from "../common/AnimatedButton";
import { GlassPanel } from "../common/GlassPanel";
import { StatusIndicator } from "../common/StatusIndicator";
import { MainLayout } from "../layout/MainLayout";

import { useServerDetailPresenter } from "../../presenters/server/useServerDetailPresenter";

interface ServerDetailViewProps {
  server: VpsServer;
}

/**
 * ServerDetailView - Detailed view of a single server
 */
export function ServerDetailView({ server: initialServer }: ServerDetailViewProps) {
  const [state, actions] = useServerDetailPresenter(initialServer);
  const { server, loading } = state;

  const isHostMachine = server.id === 'host-machine';

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 200, friction: 25 },
  });

  const formatUptime = (seconds: number): string => {
    if (seconds === 0) return "—";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days} days, ${hours} hours`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      DigitalOcean: "from-blue-500 to-blue-600",
      Vultr: "from-violet-500 to-purple-600",
      Linode: "from-green-500 to-emerald-600",
      Hetzner: "from-red-500 to-rose-600",
      "AWS Lightsail": "from-amber-500 to-orange-600",
      "Bare Metal": "from-slate-600 to-slate-700",
    };
    return colors[provider] || "from-gray-500 to-gray-600";
  };

  const handleRefresh = async () => {
    await actions.refreshData();
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back and Refresh buttons */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <AnimatedButton variant="secondary" size="sm" onClick={handleRefresh} disabled={loading}>
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </AnimatedButton>
        </div>

        {/* Header */}
        <animated.div style={fadeIn} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getProviderColor(
                server.provider
              )} flex items-center justify-center shadow-xl`}
            >
              <svg
                className="w-7 h-7 text-white"
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {server.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {server.hostname} · {server.ipAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIndicator status={server.status} size="lg" showLabel />
          </div>
        </animated.div>

        {/* Quick actions */}
        <GlassPanel className="p-5" delay={100}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Quick Actions {isHostMachine && <span className="text-xs font-normal opacity-50 ml-2">(Actions not supported for Host machine)</span>}
            </h2>
            <div className="flex gap-3">
              {server.status === "stopped" ? (
                <AnimatedButton 
                  variant="primary" 
                  size="md" 
                  onClick={actions.startServer} 
                  disabled={loading || isHostMachine}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Start Server
                </AnimatedButton>
              ) : (
                <>
                  <AnimatedButton 
                    variant="secondary" 
                    size="md" 
                    onClick={actions.restartServer} 
                    disabled={loading || isHostMachine}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restart
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="danger" 
                    size="md" 
                    onClick={actions.stopServer} 
                    disabled={loading || isHostMachine}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    Stop Server
                  </AnimatedButton>
                </>
              )}
              <AnimatedButton variant="ghost" size="md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Console
              </AnimatedButton>
            </div>
          </div>
        </GlassPanel>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Info and specs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Server Info */}
            <GlassPanel className="p-5" delay={150}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Server Information
              </h3>
              <div className="space-y-3">
                <InfoRow label="Provider" value={server.provider} />
                <InfoRow label="Location" value={server.location} />
                <InfoRow label="Operating System" value={server.os} />
                <InfoRow label="IP Address" value={server.ipAddress} />
                <InfoRow label="Hostname" value={server.hostname} />
                <InfoRow label="Uptime" value={formatUptime(server.uptime)} />
                <InfoRow label="Created" value={new Date(server.createdAt).toLocaleDateString()} />
              </div>
            </GlassPanel>

            {/* Hardware Specs */}
            <GlassPanel className="p-5" delay={200}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Hardware Specifications
              </h3>
              <div className="space-y-4">
                <SpecCard icon="⚡" label="CPU" value={`${server.specs.cpu} vCPU cores`} />
                <SpecCard icon="🧠" label="RAM" value={`${server.specs.ram} GB`} />
                <SpecCard icon="💾" label="Storage" value={`${server.specs.storage} GB SSD`} />
                <SpecCard icon="🌐" label="Bandwidth" value={`${server.specs.bandwidth} TB/month`} />
              </div>
            </GlassPanel>
          </div>

          {/* Right column - Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resource Usage */}
            <GlassPanel className="p-5" delay={250}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Resource Usage
              </h3>
              {server.status === "running" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricGauge
                    label="CPU Usage"
                    value={server.usage.cpuPercent}
                    color="cyan"
                    icon="⚡"
                  />
                  <MetricGauge
                    label="RAM Usage"
                    value={server.usage.ramPercent}
                    color="purple"
                    icon="🧠"
                  />
                  <MetricGauge
                    label="Disk Usage"
                    value={server.usage.storagePercent}
                    color="pink"
                    icon="💾"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <p>Server is not running</p>
                  <p className="text-sm">Start the server to view metrics</p>
                </div>
              )}
            </GlassPanel>

            {/* Activity Log */}
            <GlassPanel className="p-5" delay={300}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <ActivityItem
                  action="Status check"
                  time={server.lastCheckedAt}
                  icon="✅"
                />
                <div className="text-center py-4 text-xs text-gray-500 opacity-50">
                  History logs will appear here as they occur
                </div>
              </div>
            </GlassPanel>

            {/* Network */}
            <GlassPanel className="p-5" delay={350}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Network & Bandwidth
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                    {server.usage.bandwidthUsed.toFixed(1)} GB
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    of {server.specs.bandwidth * 1000} GB used this month
                  </div>
                </div>
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    style={{ width: `${(server.usage.bandwidthUsed / (server.specs.bandwidth * 1000)) * 100}%` }}
                  />
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-gray-800 dark:text-gray-200 font-medium">{value}</span>
    </div>
  );
}

function SpecCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</div>
      </div>
    </div>
  );
}

function MetricGauge({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: "cyan" | "purple" | "pink";
  icon: string;
}) {
  const getColor = () => {
    if (value >= 80) return "text-red-500";
    if (value >= 60) return "text-amber-500";
    const colors = {
      cyan: "text-cyan-500",
      purple: "text-purple-500",
      pink: "text-pink-500",
    };
    return colors[color];
  };

  const getTrackColor = () => {
    if (value >= 80) return "stroke-red-500";
    if (value >= 60) return "stroke-amber-500";
    const colors = {
      cyan: "stroke-cyan-500",
      purple: "stroke-purple-500",
      pink: "stroke-pink-500",
    };
    return colors[color];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${value * 2.51} 251`}
            className={getTrackColor()}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span className={`text-xl font-bold ${getColor()}`}>{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

function ActivityItem({ action, time, icon }: { action: string; time: string; icon: string }) {
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{action}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(time)}</div>
      </div>
    </div>
  );
}
