import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Brain, 
  Target, 
  BookOpen, 
  Zap, 
  Shield 
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Upload Past Papers",
    description: "Upload your past exam papers and let our AI analyze the question patterns over multiple years.",
  },
  {
    icon: Brain,
    title: "AI Analysis Engine",
    description: "Advanced machine learning models identify recurring themes, question styles, and topic frequencies.",
  },
  {
    icon: Target,
    title: "Predicted Questions",
    description: "Receive a curated list of likely exam questions with confidence scores based on pattern analysis.",
  },
  {
    icon: BookOpen,
    title: "Course Material RAG",
    description: "Upload your notes and textbooks. Our RAG system generates answers directly from your materials.",
  },
  {
    icon: Zap,
    title: "Instant Answers",
    description: "Get detailed, step-by-step solutions for predicted questions in seconds, not hours.",
  },
  {
    icon: Shield,
    title: "Accuracy Tracking",
    description: "See confidence levels and topic tags for each prediction, helping you focus your study time.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Everything you need to ace your exams
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-pretty">
            Zorva combines cutting-edge AI with your study materials to give you a personalized exam preparation experience.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
