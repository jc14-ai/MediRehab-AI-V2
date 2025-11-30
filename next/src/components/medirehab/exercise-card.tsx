"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, ChevronRight, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExerciseCardProps {
  name: string
  description: string
  image?: string
  score?: number | null
  feedback?: string
  onClick?: () => void
  onStartClick?: () => void
  className?: string
}

export function ExerciseCard({
  name,
  description,
  image,
  score,
  feedback,
  onClick,
  onStartClick,
  className,
}: ExerciseCardProps) {
  const hasScore = score !== null && score !== undefined
  const status = hasScore ? "completed" : "pending"

  const statusConfig = {
    pending: { label: "Pending", variant: "secondary" as const },
    completed: { label: "Completed", variant: "outline" as const },
  }

  return (
    <Card
      className={cn("overflow-hidden transition-all hover:shadow-md cursor-pointer group", className)}
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={image || `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(name)} exercise`}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge variant={statusConfig[status].variant} className="absolute top-3 right-3">
          {statusConfig[status].label}
        </Badge>
        {hasScore && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1">
              <span className="text-sm font-bold text-foreground">{score}%</span>
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

        {hasScore && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Score</span>
              <span className="font-medium text-foreground">{score}%</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
        )}

        {feedback && (
          <div className="mb-4 p-2 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-1 text-xs text-accent mb-1">
              <MessageSquare className="h-3 w-3" />
              <span>Doctor's Feedback</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{feedback}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onStartClick?.()
            }}
          >
            <Play className="h-4 w-4 mr-1" />
            {hasScore ? "Try Again" : "Start"}
          </Button>
          <Button variant="ghost" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
