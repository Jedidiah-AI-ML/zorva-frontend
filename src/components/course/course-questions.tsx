"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import { Sparkles, Lock, RefreshCw, Tag, TrendingUp } from "lucide-react"
import { useApiClient } from "@/lib/api"

interface Question {
  id: string
  question_text: string
  answer_text: string | null
  solution_steps: { steps: string[] } | null
  confidence_score: number
  topic: string
  question_type: string
}

export function CourseQuestions({ courseId }: { courseId: string }) {
  const api = useApiClient()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [userPlan, setUserPlan] = useState<"free" | "premium">("free")

  useEffect(() => {
    api.getMe().then(user => setUserPlan(user.plan)).catch(console.error)
    // Load most recent session
    api.getCourseSession(courseId)
      .then(sessions => {
        if (sessions.length > 0) {
          api.getSessionQuestions(sessions[0].session_id)
            .then(data => setQuestions(data.questions))
            .catch(console.error)
        }
      })
      .catch(console.error)
  }, [courseId])

  const handleAnalyse = async () => {
    setIsAnalysing(true)
    try {
      await api.analyseCourse(courseId)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsAnalysing(false)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const result = await api.generateQuestions(courseId)
      setQuestions(result.questions)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 dark:text-green-400"
    if (score >= 0.8) return "text-yellow-600 dark:text-yellow-400"
    return "text-orange-600 dark:text-orange-400"
  }

  const getConfidenceBg = (score: number) => {
    if (score >= 0.9) return "bg-green-100 dark:bg-green-900/30"
    if (score >= 0.8) return "bg-yellow-100 dark:bg-yellow-900/30"
    return "bg-orange-100 dark:bg-orange-900/30"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Generated Questions</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-predicted exam questions based on your materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAnalyse} disabled={isAnalysing}>
            {isAnalysing ? <><RefreshCw className="h-4 w-4 animate-spin mr-2" />Analysing...</> : "Analyse Patterns"}
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
            {isGenerating
              ? <><RefreshCw className="h-4 w-4 animate-spin" />Generating...</>
              : <><Sparkles className="h-4 w-4" />Generate Questions</>}
          </Button>
        </div>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No questions generated yet</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
              Upload your course materials and past questions, then click &quot;Analyse Patterns&quot; followed by &quot;Generate Questions&quot;.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Predicted Questions</CardTitle>
            <CardDescription>{questions.length} questions generated with confidence scores</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {questions.map((q, index) => (
                <AccordionItem key={q.id} value={q.id}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex flex-col gap-2 pr-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                        <span className="font-medium text-sm">{q.question_text}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 ml-9">
                        {q.confidence_score && (
                          <Badge variant="outline"
                            className={`gap-1 ${getConfidenceBg(q.confidence_score)} ${getConfidenceColor(q.confidence_score)} border-0`}>
                            <TrendingUp className="h-3 w-3" />
                            {Math.round(q.confidence_score * 100)}% confidence
                          </Badge>
                        )}
                        {q.topic && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Tag className="h-3 w-3" />{q.topic}
                          </Badge>
                        )}
                        {q.question_type && (
                          <Badge variant="secondary" className="text-xs">{q.question_type}</Badge>
                        )}
                        {!q.answer_text && userPlan === "free" && (
                          <Badge variant="outline" className="gap-1 text-xs border-primary/50 text-primary">
                            <Lock className="h-3 w-3" />Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-9 space-y-4">
                      {!q.answer_text && userPlan === "free" ? (
                        <div className="relative">
                          <div className="blur-sm select-none pointer-events-none">
                            <div className="rounded-lg bg-muted p-4">
                              <h4 className="font-medium mb-2">Answer</h4>
                              <p className="text-sm text-muted-foreground">Upgrade to premium to see the full answer and solution steps.</p>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg">
                            <Lock className="h-8 w-8 text-primary mb-2" />
                            <p className="font-medium">Premium Content</p>
                            <p className="text-sm text-muted-foreground mb-3">Upgrade to see the full answer</p>
                            <Button size="sm" asChild>
                              <a href="/billing">Upgrade to Premium</a>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {q.answer_text && (
                            <div className="rounded-lg bg-muted p-4">
                              <h4 className="font-medium mb-2">Answer</h4>
                              <p className="text-sm text-muted-foreground">{q.answer_text}</p>
                            </div>
                          )}
                          {q.solution_steps?.steps && q.solution_steps.steps.length > 0 && (
                            <div className="rounded-lg border p-4">
                              <h4 className="font-medium mb-3">Solution Steps</h4>
                              <ol className="space-y-2">
                                {q.solution_steps.steps.map((step, si) => (
                                  <li key={si} className="flex gap-3 text-sm">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{si + 1}</span>
                                    <span className="text-muted-foreground">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}