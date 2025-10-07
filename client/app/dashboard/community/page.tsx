import { CommunityFeed } from "@/app/components/community/community-feed";
import { CommunityGuidelines } from "@/app/components/community/community-guidelines";
import { NewPostButton } from "@/app/components/community/new-post-button";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { QuickSosButton } from "@/app/components/dashboard/quick-sos-button";

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1">
        <DashboardHeader />

        <main className="container mx-auto max-w-6xl p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
                Community Support
              </h1>
              <p className="mt-2 text-muted-foreground">
                A safe space to share, connect, and support each other
              </p>
            </div>
            <NewPostButton />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CommunityFeed />
            </div>
            <div className="lg:col-span-1">
              <CommunityGuidelines />
            </div>
          </div>
        </main>
      </div>

      <QuickSosButton />
    </div>
  );
}
