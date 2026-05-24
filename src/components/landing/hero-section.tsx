"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Sparkles, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Sparkles className="mr-2 h-3 w-3" />
            AI-Powered Exam Preparation
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-balance">Predict Your Exam</span>
            <span className="block text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Questions with AI
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            Zorva analyzes past exam papers and your course materials to predict likely questions. 
            Get AI-generated answers backed by your own notes and textbooks.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-8">
                Start Preparing Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="px-8">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Question Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Students Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Courses Covered</div>
            </div>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">AI Question Prediction</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Machine learning models analyze patterns from past papers to predict likely exam questions.
            </p>
          </div>

          <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">RAG-Powered Answers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get accurate answers generated from your own course materials and notes.
            </p>
          </div>

          <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Pattern Analysis</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Identifies recurring themes and topics that frequently appear in examinations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
