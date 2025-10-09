import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { SosContent } from "@/app/components/sos/sos-content";

export default function SosPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <SosContent />
        </main>
      </div>
    </div>
  );
}
