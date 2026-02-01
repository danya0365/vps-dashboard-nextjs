import { DashboardView } from "@/src/presentation/components/dashboard/DashboardView";
import { createServerDashboardPresenter } from "@/src/presentation/presenters/dashboard/DashboardPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Servers | VPS Dashboard",
  description: "View and manage all your VPS servers",
};

/**
 * Servers Page - Shows all servers (same as dashboard for now)
 */
export default async function ServersPage() {
  const presenter = createServerDashboardPresenter();
  const viewModel = await presenter.getViewModel();

  return <DashboardView initialViewModel={viewModel} />;
}
