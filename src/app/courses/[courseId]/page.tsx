"use client"

import { use, Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CourseDocuments } from "@/components/course/course-documents"
import { CourseQuestions } from "@/components/course/course-questions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function CoursePageContent({ courseId }: { courseId: string }) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "documents"

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />Back to Courses
            </Button>
          </Link>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />Documents
            </TabsTrigger>
            <TabsTrigger value="questions" className="gap-2">
              <Sparkles className="h-4 w-4" />Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <CourseDocuments courseId={courseId} />
          </TabsContent>

          <TabsContent value="questions">
            <CourseQuestions courseId={courseId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <CoursePageContent courseId={resolvedParams.courseId} />
    </Suspense>
  )
}