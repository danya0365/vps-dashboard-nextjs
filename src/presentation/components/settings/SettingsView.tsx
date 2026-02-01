"use client";

import { animated, useSpring } from "@react-spring/web";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatedButton } from "../common/AnimatedButton";
import { GlassPanel } from "../common/GlassPanel";
import { MainLayout } from "../layout/MainLayout";

/**
 * SettingsView - User preferences and settings
 */
export function SettingsView() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState({
    serverDown: true,
    highCpu: true,
    highRam: false,
    backupComplete: true,
  });
  const [refreshInterval, setRefreshInterval] = useState("30");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 200, friction: 25 },
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <animated.div style={fadeIn}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your dashboard preferences
          </p>
        </animated.div>

        {/* Appearance */}
        <GlassPanel className="p-6" delay={50}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred color scheme
                </p>
              </div>
              {mounted && (
                <div className="flex gap-2">
                  <ThemeButton
                    label="Light"
                    icon="☀️"
                    isActive={resolvedTheme === "light" && theme !== "system"}
                    onClick={() => setTheme("light")}
                  />
                  <ThemeButton
                    label="Dark"
                    icon="🌙"
                    isActive={resolvedTheme === "dark" && theme !== "system"}
                    onClick={() => setTheme("dark")}
                  />
                  <ThemeButton
                    label="System"
                    icon="💻"
                    isActive={theme === "system"}
                    onClick={() => setTheme("system")}
                  />
                </div>
              )}
            </div>
          </div>
        </GlassPanel>

        {/* Notifications */}
        <GlassPanel className="p-6" delay={100}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <ToggleSetting
              label="Server Down Alerts"
              description="Get notified when a server goes offline"
              checked={notifications.serverDown}
              onChange={(v) => setNotifications((p) => ({ ...p, serverDown: v }))}
            />
            <ToggleSetting
              label="High CPU Usage"
              description="Alert when CPU usage exceeds 80%"
              checked={notifications.highCpu}
              onChange={(v) => setNotifications((p) => ({ ...p, highCpu: v }))}
            />
            <ToggleSetting
              label="High RAM Usage"
              description="Alert when RAM usage exceeds 80%"
              checked={notifications.highRam}
              onChange={(v) => setNotifications((p) => ({ ...p, highRam: v }))}
            />
            <ToggleSetting
              label="Backup Complete"
              description="Notify when scheduled backups finish"
              checked={notifications.backupComplete}
              onChange={(v) => setNotifications((p) => ({ ...p, backupComplete: v }))}
            />
          </div>
        </GlassPanel>

        {/* Dashboard Settings */}
        <GlassPanel className="p-6" delay={150}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Dashboard Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Auto Refresh</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  How often to refresh server data
                </p>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-cyan-500"
              >
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
                <option value="0">Manual only</option>
              </select>
            </div>
          </div>
        </GlassPanel>

        {/* Account */}
        <GlassPanel className="p-6" delay={200}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Account
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl text-white font-bold">
              A
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">Admin User</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">admin@vps-dashboard.com</p>
            </div>
          </div>
          <div className="flex gap-3">
            <AnimatedButton variant="secondary" size="md">
              Edit Profile
            </AnimatedButton>
            <AnimatedButton variant="ghost" size="md">
              Change Password
            </AnimatedButton>
          </div>
        </GlassPanel>

        {/* Danger Zone */}
        <GlassPanel className="p-6 border-red-200 dark:border-red-800" delay={250}>
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Delete All Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete all servers and settings
              </p>
            </div>
            <AnimatedButton variant="danger" size="md">
              Delete All
            </AnimatedButton>
          </div>
        </GlassPanel>
      </div>
    </MainLayout>
  );
}

function ThemeButton({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
        ${
          isActive
            ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        }
      `}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer
          ${checked ? "bg-gradient-to-r from-cyan-500 to-purple-600" : "bg-gray-300 dark:bg-gray-600"}
        `}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200
            ${checked ? "translate-x-7" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
