import { DashboardView } from "@/src/presentation/components/dashboard/DashboardView";
import { createServerDashboardPresenter } from "@/src/presentation/presenters/dashboard/DashboardPresenterServerFactory";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Dashboard | VPS Dashboard",
  description: "Monitor and manage your virtual private servers",
};

/**
 * Home Page - Server Component for dashboard
 * Uses presenter pattern following Clean Architecture
 */
export default async function HomePage() {
  const presenter = createServerDashboardPresenter();
  const viewModel = await presenter.getViewModel();

  return <DashboardView initialViewModel={viewModel} />;
}
