"use client";

import { DashboardStats, VpsServer } from "@/src/application/repositories/IVpsRepository";
import { animated, useSpring } from "@react-spring/web";
import { GlassPanel } from "../common/GlassPanel";
import { MainLayout } from "../layout/MainLayout";

interface AnalyticsViewProps {
  stats: DashboardStats;
  servers: VpsServer[];
}

/**
 * AnalyticsView - Analytics dashboard with charts
 */
export function AnalyticsView({ stats, servers }: AnalyticsViewProps) {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 200, friction: 25 },
  });

  // Calculate provider distribution
  const providerStats = servers.reduce((acc, s) => {
    acc[s.provider] = (acc[s.provider] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate location distribution
  const locationStats = servers.reduce((acc, s) => {
    acc[s.location] = (acc[s.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <animated.div style={fadeIn}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Insights and statistics about your infrastructure
          </p>
        </animated.div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <OverviewCard
            title="Total Servers"
            value={stats.totalServers}
            change="+2"
            changeType="positive"
            delay={50}
          />
          <OverviewCard
            title="Active Servers"
            value={stats.runningServers}
            change={`${Math.round((stats.runningServers / stats.totalServers) * 100)}%`}
            changeType="neutral"
            delay={100}
          />
          <OverviewCard
            title="Avg CPU Usage"
            value={`${stats.avgCpuUsage}%`}
            change="-5%"
            changeType="positive"
            delay={150}
          />
          <OverviewCard
            title="Avg RAM Usage"
            value={`${stats.avgRamUsage}%`}
            change="+3%"
            changeType="negative"
            delay={200}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Server Status Distribution */}
          <GlassPanel className="p-6" delay={250}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Server Status Distribution
            </h3>
            <div className="flex items-center justify-center gap-8">
              <DonutChart
                data={[
                  { label: "Running", value: stats.runningServers, color: "#10b981" },
                  { label: "Stopped", value: stats.stoppedServers, color: "#6b7280" },
                  { label: "Error", value: stats.errorServers, color: "#ef4444" },
                ]}
              />
              <div className="space-y-3">
                <ChartLegend label="Running" value={stats.runningServers} color="bg-green-500" />
                <ChartLegend label="Stopped" value={stats.stoppedServers} color="bg-gray-500" />
                <ChartLegend label="Error" value={stats.errorServers} color="bg-red-500" />
              </div>
            </div>
          </GlassPanel>

          {/* Provider Distribution */}
          <GlassPanel className="p-6" delay={300}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Servers by Provider
            </h3>
            <div className="space-y-3">
              {Object.entries(providerStats).map(([provider, count], i) => (
                <BarChartRow
                  key={provider}
                  label={provider}
                  value={count}
                  max={stats.totalServers}
                  color={getProviderColor(provider)}
                  delay={i * 50}
                />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Location and Resource charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Distribution */}
          <GlassPanel className="p-6" delay={350}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Servers by Location
            </h3>
            <div className="space-y-3">
              {Object.entries(locationStats).map(([location, count], i) => (
                <BarChartRow
                  key={location}
                  label={location}
                  value={count}
                  max={stats.totalServers}
                  color="from-cyan-400 to-cyan-500"
                  delay={i * 50}
                />
              ))}
            </div>
          </GlassPanel>

          {/* Resource Allocation */}
          <GlassPanel className="p-6" delay={400}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Resource Allocation
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <ResourceCircle
                label="CPU Cores"
                value={stats.totalCpu}
                unit="cores"
                color="cyan"
              />
              <ResourceCircle
                label="Total RAM"
                value={stats.totalRam}
                unit="GB"
                color="purple"
              />
              <ResourceCircle
                label="Storage"
                value={(stats.totalStorage / 1000).toFixed(1)}
                unit="TB"
                color="pink"
              />
            </div>
          </GlassPanel>
        </div>

        {/* Usage trend (mock) */}
        <GlassPanel className="p-6" delay={450}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Resource Usage Trend (Last 7 Days)
            </h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                CPU
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                RAM
              </span>
            </div>
          </div>
          <LineChart />
        </GlassPanel>
      </div>
    </MainLayout>
  );
}

function OverviewCard({
  title,
  value,
  change,
  changeType,
  delay,
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  delay: number;
}) {
  const changeColors = {
    positive: "text-green-500 bg-green-500/10",
    negative: "text-red-500 bg-red-500/10",
    neutral: "text-gray-500 bg-gray-500/10",
  };

  return (
    <GlassPanel className="p-5" delay={delay}>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${changeColors[changeType]}`}>
          {change}
        </span>
      </div>
    </GlassPanel>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let accumulatedPercent = 0;

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 36 36" className="w-32 h-32">
        {data.map((item, i) => {
          const percent = (item.value / total) * 100;
          const strokeDasharray = `${percent} ${100 - percent}`;
          const strokeDashoffset = 100 - accumulatedPercent + 25;
          accumulatedPercent += percent;

          return (
            <circle
              key={i}
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={item.color}
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{total}</span>
      </div>
    </div>
  );
}

function ChartLegend({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-white ml-auto">{value}</span>
    </div>
  );
}

function BarChartRow({
  label,
  value,
  max,
  color,
  delay,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  delay: number;
}) {
  const percent = (value / max) * 100;

  return (
    <div
      className="animate-start-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-gray-800 dark:text-white">{value}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ResourceCircle({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string | number;
  unit: string;
  color: "cyan" | "purple" | "pink";
}) {
  const colors = {
    cyan: "from-cyan-400 to-cyan-500",
    purple: "from-purple-400 to-purple-500",
    pink: "from-pink-400 to-pink-500",
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-[10px] text-white/80">{unit}</div>
        </div>
      </div>
      <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

function LineChart() {
  // Mock data for the line chart
  const cpuData = [45, 52, 48, 61, 55, 42, 48];
  const ramData = [62, 58, 65, 70, 68, 62, 65];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="h-48 flex items-end gap-2">
      {days.map((day, i) => (
        <div key={day} className="flex-1 flex flex-col items-center gap-2">
          <div className="flex-1 w-full flex items-end justify-center gap-1">
            {/* CPU bar */}
            <div
              className="w-3 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t transition-all duration-500"
              style={{ height: `${cpuData[i]}%` }}
            />
            {/* RAM bar */}
            <div
              className="w-3 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all duration-500"
              style={{ height: `${ramData[i]}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500">{day}</span>
        </div>
      ))}
    </div>
  );
}

function getProviderColor(provider: string): string {
  const colors: Record<string, string> = {
    DigitalOcean: "from-blue-400 to-blue-500",
    Vultr: "from-violet-400 to-purple-500",
    Linode: "from-green-400 to-emerald-500",
    Hetzner: "from-red-400 to-rose-500",
    "AWS Lightsail": "from-amber-400 to-orange-500",
  };
  return colors[provider] || "from-gray-400 to-gray-500";
}
