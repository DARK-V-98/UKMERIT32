"use client"

import { useState } from "react"
import { lessons, quizzes } from "@/lib/mock-data"
import { notFound, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Award } from "lucide-react"
import { ParticleButton } from "@/components/ui/particle-button"

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const lesson = lessons.find(l => l.id === params.id)
  const quiz = quizzes[params.id]

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  if (!lesson || !quiz) {
    notFound()
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({...prev, [currentQuestionIndex]: answer}))
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleSubmit = () => {
    let finalScore = 0
    quiz.questions.forEach((q, index) => {
      if(selectedAnswers[index] === q.correctAnswer) {
        finalScore++;
      }
    })
    setScore(finalScore)
    setShowResult(true)
  }

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const currentQuestion = quiz.questions[currentQuestionIndex]

  if(showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Award className="h-8 w-8"/>
              </div>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              <CardDescription>You finished the quiz for "{lesson.title}".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{percentage}%</p>
              <p className="text-muted-foreground">You answered {score} out of {quiz.questions.length} questions correctly.</p>
              <div className="flex gap-4">
                <Button variant="outline" className="w-full" onClick={() => router.back()}>Back to Lesson</Button>
                <ParticleButton className="w-full" onClick={() => router.push('/lessons')}>Explore More Lessons</ParticleButton>
              </div>
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-primary font-semibold">{lesson.title}</p>
          <h1 className="text-3xl font-bold tracking-tight">Comprehension Quiz</h1>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
                <CardTitle>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 
                    <CheckCircle2 className="text-green-500" /> : 
                    selectedAnswers[currentQuestionIndex] ? <XCircle className="text-red-500" /> : null
                  }
                </div>
            </div>
            <Progress value={progress} className="w-full" />
            <CardDescription className="pt-4 text-lg text-foreground">{currentQuestion.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedAnswers[currentQuestionIndex]} 
              onValueChange={handleAnswerSelect}
              className="grid gap-4"
            >
              {currentQuestion.options.map((option, index) => (
                <Label key={index} className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                  <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                  <span>{option}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          {currentQuestionIndex < quiz.questions.length - 1 ? (
             <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex]}>Next</Button>
          ) : (
            <ParticleButton onClick={handleSubmit} disabled={!selectedAnswers[currentQuestionIndex]}>Finish Quiz</ParticleButton>
          )}
        </div>
      </div>
    </div>
  )
}
