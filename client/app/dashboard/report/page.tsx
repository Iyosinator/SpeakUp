import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { QuickSosButton } from "@/app/components/dashboard/quick-sos-button";
import { ReportForm } from "@/app/components/report/report-form";

export default function ReportPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1">
        <DashboardHeader />

        <main className="container mx-auto max-w-4xl p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              File a Report
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your safety is our priority. All reports are encrypted and can be
              submitted anonymously.
            </p>
          </div>

          <ReportForm />
        </main>
      </div>

      <QuickSosButton />
    </div>
  );
}