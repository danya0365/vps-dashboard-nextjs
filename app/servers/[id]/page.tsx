import { ServerDetailView } from "@/src/presentation/components/server/ServerDetailView";
import { createServerDashboardPresenter } from "@/src/presentation/presenters/dashboard/DashboardPresenterServerFactory";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface ServerDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ServerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const presenter = createServerDashboardPresenter();
  const viewModel = await presenter.getViewModel();
  const server = viewModel.servers.find((s) => s.id === id);

  return {
    title: server ? `${server.name} | VPS Dashboard` : "Server Not Found",
    description: server
      ? `Manage ${server.name} - ${server.hostname}`
      : "Server not found",
  };
}

/**
 * Server Detail Page
 */
export default async function ServerDetailPage({ params }: ServerDetailPageProps) {
  const { id } = await params;
  const presenter = createServerDashboardPresenter();
  const viewModel = await presenter.getViewModel();
  const server = viewModel.servers.find((s) => s.id === id);

  if (!server) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Server Not Found
          </h1>
          <p className="text-muted mb-4">The server you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <ServerDetailView server={server} />;
}
