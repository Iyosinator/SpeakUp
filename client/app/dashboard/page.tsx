import { AwarenessSection } from "../components/dashboard/awareness-section";
import { DashboardHeader } from "../components/dashboard/dashboard-header";
import { DashboardSidebar } from "../components/dashboard/dashboard-sidebar"
import { FeatureCards } from "../components/dashboard/feature-cards";
import { QuickSosButton } from "../components/dashboard/quick-sos-button";
import { RecentActivity } from "../components/dashboard/recent-activity";
import { WelcomeSection } from "../components/dashboard/welcome-section";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />  
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto max-w-7xl p-6 lg:p-8">
          <WelcomeSection />
          <FeatureCards />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div className="lg:col-span-1">
              <AwarenessSection />
            </div>
          </div>
        </main>
      </div>

      {/* Quick SOS Button - Fixed Position */}
      <QuickSosButton />
    </div>
  );
}
