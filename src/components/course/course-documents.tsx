"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Upload, FileText, File, Clock, CheckCircle2,
  XCircle, Loader2, Trash2
} from "lucide-react"
import { useApiClient } from "@/lib/api"

type DocumentStatus = "pending" | "processing" | "ready" | "failed"
type DocumentType = "course_materials" | "past_questions"

interface Document {
  id: string
  file_name: string
  file_type: string
  doc_type: string
  status: DocumentStatus
  created_at: string
}

const statusConfig: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
  pending: { label: "Pending", variant: "outline", icon: Clock },
  processing: { label: "Processing", variant: "secondary", icon: Loader2 },
  ready: { label: "Ready", variant: "default", icon: CheckCircle2 },
  failed: { label: "Failed", variant: "destructive", icon: XCircle },
}

export function CourseDocuments({ courseId }: { courseId: string }) {
  const api = useApiClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadType, setUploadType] = useState<DocumentType>("course_materials")
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    api.getCourseDocuments(courseId)
      .then(setDocuments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [courseId])

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const uploadFn = uploadType === "course_materials"
        ? api.uploadCourseMaterial
        : api.uploadPastQuestion
      const doc = await uploadFn(courseId, selectedFile)
      setDocuments(prev => [doc, ...prev])
      setIsUploadOpen(false)
      setSelectedFile(null)

      // Poll for status updates
      const poll = setInterval(async () => {
        try {
          const status = await api.getDocumentStatus(doc.id)
          setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, status: status.status } : d))
          if (status.status === "ready" || status.status === "failed") clearInterval(poll)
        } catch { clearInterval(poll) }
      }, 3000)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDocument(id)
      setDocuments(prev => prev.filter(d => d.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const courseMaterials = documents.filter(d => d.doc_type === "course_materials")
  const pastQuestions = documents.filter(d => d.doc_type === "past_questions")

  const DocumentRow = ({ doc }: { doc: Document }) => {
    const status = statusConfig[doc.status] || statusConfig.pending
    const StatusIcon = status.icon
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">{doc.file_name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(doc.created_at).toLocaleDateString("en-NG")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className="gap-1">
            <StatusIcon className={`h-3 w-3 ${doc.status === "processing" ? "animate-spin" : ""}`} />
            {status.label}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => handleDelete(doc.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Documents</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload your course materials and past exam questions</p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Upload className="h-4 w-4" />Upload Document</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Choose the type of document you want to upload.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label>Document Type</Label>
                <RadioGroup value={uploadType} onValueChange={v => setUploadType(v as DocumentType)} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="course_materials" id="course_materials" className="peer sr-only" />
                    <Label htmlFor="course_materials" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer">
                      <FileText className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Course Material</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="past_questions" id="past_questions" className="peer sr-only" />
                    <Label htmlFor="past_questions" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer">
                      <File className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Past Question</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label>Select File</Label>
                <input type="file" accept=".pdf,.doc,.docx,.pptx"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer" />
                <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX (Free: max 10MB · Premium: max 50MB)</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />Course Materials
          </CardTitle>
          <CardDescription>Lecture notes, textbooks, and study guides</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-center py-8 text-muted-foreground">Loading...</p>
            : courseMaterials.length === 0
              ? <div className="text-center py-8 text-muted-foreground">No course materials uploaded yet</div>
              : <div className="space-y-2">{courseMaterials.map(doc => <DocumentRow key={doc.id} doc={doc} />)}</div>
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <File className="h-5 w-5 text-accent" />Past Questions
          </CardTitle>
          <CardDescription>Previous exam papers for pattern analysis</CardDescription>
        </CardHeader>
        <CardContent>
          {pastQuestions.length === 0
            ? <div className="text-center py-8 text-muted-foreground">No past questions uploaded yet</div>
            : <div className="space-y-2">{pastQuestions.map(doc => <DocumentRow key={doc.id} doc={doc} />)}</div>
          }
        </CardContent>
      </Card>
    </div>
  )
}