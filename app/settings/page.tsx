import { SettingsView } from "@/src/presentation/components/settings/SettingsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | VPS Dashboard",
  description: "Manage your VPS Dashboard preferences",
};

/**
 * Settings Page
 */
export default function SettingsPage() {
  return <SettingsView />;
}
