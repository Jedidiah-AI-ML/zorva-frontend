import { Badge } from "@/components/ui/badge"

const steps = [
  {
    step: "01",
    title: "Create Your Course",
    description: "Add your course details including name, institution, and department to get started.",
  },
  {
    step: "02",
    title: "Upload Materials",
    description: "Upload your past exam papers, course notes, textbooks, and any other relevant study materials.",
  },
  {
    step: "03",
    title: "AI Processing",
    description: "Our AI analyzes your materials, identifies patterns, and builds a knowledge base from your content.",
  },
  {
    step: "04",
    title: "Get Predictions",
    description: "Receive AI-predicted exam questions with detailed answers sourced from your own materials.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Four simple steps to exam success
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-pretty">
            Get started in minutes and let AI do the heavy lifting for your exam preparation.
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
