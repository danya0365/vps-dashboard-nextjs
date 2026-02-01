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
                <div className="space-y-8">
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

                  {/* Detailed Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detailed Memory</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <SmallStat label="RAM Used" value={`${server.usage.ramUsage.used} MB`} />
                        <SmallStat label="RAM Total" value={`${server.usage.ramUsage.total} MB`} />
                        <SmallStat label="Swap Used" value={`${server.usage.ramUsage.swapUsed} MB`} color={server.usage.ramUsage.swapUsed > 0 ? "text-amber-500" : ""} />
                        <SmallStat label="Swap Total" value={`${server.usage.ramUsage.swapTotal} MB`} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Performance</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <SmallStat label="Load (1/5/15m)" value={server.usage.loadAverages.map(l => l.toFixed(2)).join(' / ')} />
                        <SmallStat label="I/O Wait" value={`${server.usage.ioWait.toFixed(2)}%`} color={server.usage.ioWait > 5 ? "text-red-500" : ""} />
                        <SmallStat label="Net In" value={`${server.usage.networkThroughput.in.toLocaleString()} kbps`} />
                        <SmallStat label="Net Out" value={`${server.usage.networkThroughput.out.toLocaleString()} kbps`} />
                      </div>
                    </div>
                  </div>
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

            {/* Docker Containers */}
            {server.dockerContainers && server.dockerContainers.length > 0 && (
              <GlassPanel className="p-5" delay={400}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Docker Containers ({server.dockerContainers.length})
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded-full font-medium">
                    Docker Active
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">CPU%</th>
                        <th className="pb-2 font-medium">Memory</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium text-right">Image</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {server.dockerContainers.map((container) => (
                        <tr key={container.name} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                          <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                            <div className="flex flex-col">
                              <span>{container.name}</span>
                              <span className="text-[10px] text-gray-400 font-normal">{container.uptime}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            {container.cpuPercent !== undefined ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${container.cpuPercent > 50 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                                            style={{ width: `${Math.min(container.cpuPercent, 100)}%` }} 
                                        />
                                    </div>
                                    <span className="text-xs font-mono">{container.cpuPercent.toFixed(1)}%</span>
                                </div>
                            ) : '—'}
                          </td>
                          <td className="py-3">
                            {container.memoryUsage !== undefined ? (
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono">{container.memoryUsage} MB</span>
                                    {container.memoryLimit && (
                                        <div className="w-16 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                                            <div 
                                                className="h-full bg-purple-500" 
                                                style={{ width: `${(container.memoryUsage / container.memoryLimit) * 100}%` }} 
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : '—'}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                              container.status.includes('Up') 
                                ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                                : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${container.status.includes('Up') ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                              {container.status.split(' ')[0]}
                            </span>
                          </td>
                          <td className="py-3 text-right text-gray-500 dark:text-gray-400 text-[10px] font-mono truncate max-w-[120px]">{container.image}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassPanel>
            )}

            {/* System Services */}
            {server.services && server.services.length > 0 && (
              <GlassPanel className="p-5" delay={450}>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Active System Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {server.services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${service.status === 'running' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-400'}`} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{service.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono italic">systemd</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}
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

function SmallStat({ label, value, color = "" }: { label: string; value: string | number; color?: string }) {
    return (
        <div className="p-2.5 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
            <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-tight">{label}</div>
            <div className={`text-xs font-bold mt-0.5 truncate ${color || "text-gray-700 dark:text-gray-300"}`}>{value}</div>
        </div>
    );
}
