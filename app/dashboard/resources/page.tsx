import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { QuickSosButton } from "@/app/components/dashboard/quick-sos-button";
import { ResourcesContent } from "@/app/components/resources/resources-content";

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <ResourcesContent />
        </main>
      </div>

      <QuickSosButton />
    </div>
  );
}
