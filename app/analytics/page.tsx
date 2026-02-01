import { AnalyticsView } from "@/src/presentation/components/analytics/AnalyticsView";
import { createServerDashboardPresenter } from "@/src/presentation/presenters/dashboard/DashboardPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Analytics | VPS Dashboard",
  description: "View infrastructure analytics and usage statistics",
};

/**
 * Analytics Page
 */
export default async function AnalyticsPage() {
  const presenter = createServerDashboardPresenter();
  const viewModel = await presenter.getViewModel();

  return <AnalyticsView stats={viewModel.stats} servers={viewModel.servers} />;
}
