"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, FileText, Eye, Sparkles, Trash2, Building2, GraduationCap, Calendar } from "lucide-react"
import { useApiClient } from "@/lib/api"


interface Course {
  id: string
  name: string
  institution: string
  department: string
  is_active: boolean
  created_at: string
}

export function CourseGrid() {
  const router = useRouter()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const api = useApiClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newCourse, setNewCourse] = useState({ name: "", institution: "", department: "" })

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAddCourse = async () => {
    if (!newCourse.name) return
    setIsCreating(true)
    try {
      const course = await api.createCourse(newCourse)
      setCourses(prev => [course, ...prev])
      setNewCourse({ name: "", institution: "", department: "" })
      setIsAddDialogOpen(false)
    } catch (err: any) {
      if (err.message.includes("402") || err.message.includes("upgrade") || err.message.includes("maximum")) {
        setIsAddDialogOpen(false)
        setShowUpgradeDialog(true)
      } else {
        alert(err.message)
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      await api.deleteCourse(id)
      setCourses(prev => prev.filter(c => c.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <p className="text-muted-foreground">Loading courses...</p>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">Manage your courses and generate exam questions</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Course</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Enter the details of your course to start preparing for exams.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" placeholder="e.g., Thermodynamics (THM 301)"
                  value={newCourse.name}
                  onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" placeholder="e.g., Landmark"
                  value={newCourse.institution}
                  onChange={e => setNewCourse({ ...newCourse, institution: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="e.g., Mechanical Engineering"
                  value={newCourse.department}
                  onChange={e => setNewCourse({ ...newCourse, department: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCourse} disabled={isCreating || !newCourse.name}>
                {isCreating ? "Creating..." : "Add Course"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
            Add your first course to start uploading materials and generating exam questions.
          </p>
          <Button className="mt-6 gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />Add Your First Course
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <Card key={course.id} className="group relative flex flex-col transition-all hover:shadow-lg hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight line-clamp-2">{course.name}</h3>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  {course.institution && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="truncate">{course.institution}</span>
                    </div>
                  )}
                  {course.department && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span className="truncate">{course.department}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-3">
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Created {course.created_at ? new Date(course.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" }) : "Recently"}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 pt-3 border-t">
                <Link href={`/courses/${course.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <Eye className="h-3.5 w-3.5" />View
                  </Button>
                </Link>
                <Link href={`/courses/${course.id}?tab=questions`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />Generate
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Course</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{course.name}&quot;? This will remove all uploaded documents and generated questions. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCourse(course.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Upgrade dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Course Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              Free plan allows a maximum of 2 active courses.
              Deleting a course does not free up a slot — upgrade to
              Premium for unlimited courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/billing")}>
              Upgrade to Premium
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}