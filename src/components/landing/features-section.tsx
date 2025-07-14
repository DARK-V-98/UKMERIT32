import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Video, Award, BarChart3, Users } from "lucide-react"

const features = [
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Video Lesson Library",
    description: "Access a vast library of high-quality video lessons covering grammar, vocabulary, and pronunciation."
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Interactive Quizzes",
    description: "Test your comprehension and reinforce learning with quizzes that accompany each lesson."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Progress Tracking",
    description: "Monitor your learning journey with personalized feedback and detailed progress reports."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Discussion Forums",
    description: "Engage with fellow students and instructors to ask questions and share insights."
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Everything You Need to Succeed
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Our platform is designed to provide a comprehensive and engaging learning experience.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="mt-1">{feature.icon}</div>
              <div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
