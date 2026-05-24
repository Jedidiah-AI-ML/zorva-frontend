import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CourseGrid } from "@/components/dashboard/course-grid"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CourseGrid />
      </main>
    </div>
  )
}
