"use client";

import { DashboardViewModel } from "@/src/presentation/presenters/dashboard/DashboardPresenter";
import { useDashboardPresenter } from "@/src/presentation/presenters/dashboard/useDashboardPresenter";
import { animated, useSpring } from "@react-spring/web";
import { AnimatedButton } from "../common/AnimatedButton";
import { GlassPanel } from "../common/GlassPanel";
import { MainLayout } from "../layout/MainLayout";
import { ServerCard } from "./ServerCard";

interface DashboardViewProps {
  initialViewModel: DashboardViewModel;
}

/**
 * DashboardView - Main dashboard view
 * Shows VPS servers grid and stats overview
 */
export function DashboardView({ initialViewModel }: DashboardViewProps) {
  const [state, actions] = useDashboardPresenter(initialViewModel);
  const { viewModel, loading, actionLoading, error } = state;
  
  const servers = viewModel?.servers || [];
  const stats = viewModel?.stats || initialViewModel.stats;

  // Stagger animation
  const heroSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 200, friction: 25 },
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero section */}
        <animated.div style={heroSpring} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Server Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Monitor and manage your virtual private servers
            </p>
          </div>
          <AnimatedButton
            variant="secondary"
            onClick={actions.refreshData}
            disabled={loading}
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </AnimatedButton>
        </animated.div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard
            label="Total Servers"
            value={stats.totalServers}
            icon="🖥️"
            delay={50}
          />
          <StatCard
            label="Running"
            value={stats.runningServers}
            icon="✅"
            color="text-green-500"
            delay={100}
          />
          <StatCard
            label="Stopped"
            value={stats.stoppedServers}
            icon="⏸️"
            color="text-gray-500"
            delay={150}
          />
          <StatCard
            label="Errors"
            value={stats.errorServers}
            icon="⚠️"
            color="text-red-500"
            delay={200}
          />
          <StatCard
            label="Avg CPU"
            value={`${stats.avgCpuUsage}%`}
            icon="⚡"
            color="text-cyan-500"
            delay={250}
          />
          <StatCard
            label="Avg RAM"
            value={`${stats.avgRamUsage}%`}
            icon="🧠"
            color="text-purple-500"
            delay={300}
          />
        </div>

        {/* Resource summary */}
        <GlassPanel className="p-5" delay={350}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Total Resources
            </h2>
            <div className="flex items-center gap-6 text-sm">
              <ResourceItem
                label="CPU Cores"
                value={stats.totalCpu}
                icon={
                  <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                }
              />
              <ResourceItem
                label="RAM"
                value={`${stats.totalRam} GB`}
                icon={
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              />
              <ResourceItem
                label="Storage"
                value={`${(stats.totalStorage / 1000).toFixed(1)} TB`}
                icon={
                  <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                }
              />
            </div>
          </div>
        </GlassPanel>

        {/* Server grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Your Servers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {servers.map((server, index) => (
              <div
                key={server.id}
                style={{ animationDelay: `${400 + index * 50}ms` }}
                className="animate-start-hidden animate-card-enter"
              >
                <ServerCard
                  server={server}
                  isLoading={actionLoading === server.id}
                  onStart={actions.startServer}
                  onStop={actions.stopServer}
                  onRestart={actions.restartServer}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  delay?: number;
}

function StatCard({ label, value, icon, color = "text-gray-700 dark:text-gray-300", delay = 0 }: StatCardProps) {
  return (
    <GlassPanel className="p-4" delay={delay}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className={`text-xl font-bold ${color}`}>{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </GlassPanel>
  );
}

interface ResourceItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function ResourceItem({ label, value, icon }: ResourceItemProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
        <span className="text-gray-500 dark:text-gray-400 ml-1">{label}</span>
      </div>
    </div>
  );
}
