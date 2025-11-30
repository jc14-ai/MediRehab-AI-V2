"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, AlertTriangle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface Feedback {
  id: string
  type: "praise" | "improvement" | "tip"
  message: string
  date: string
  doctorName?: string
}

interface FeedbackPanelProps {
  feedback: Feedback[]
  className?: string
}

export function FeedbackPanel({ feedback, className }: FeedbackPanelProps) {
  const getIcon = (type: Feedback["type"]) => {
    switch (type) {
      case "praise":
        return <ThumbsUp className="h-4 w-4 text-accent" />
      case "improvement":
        return <AlertTriangle className="h-4 w-4 text-chart-3" />
      case "tip":
        return <Lightbulb className="h-4 w-4 text-primary" />
    }
  }

  const getTypeLabel = (type: Feedback["type"]) => {
    switch (type) {
      case "praise":
        return { label: "Great job!", className: "bg-accent/10 text-accent" }
      case "improvement":
        return { label: "To improve", className: "bg-chart-3/10 text-chart-3" }
      case "tip":
        return { label: "Tip", className: "bg-primary/10 text-primary" }
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Doctor's Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feedback.length > 0 ? (
          <div className="space-y-4">
            {feedback.map((item) => {
              const typeConfig = getTypeLabel(item.type)
              return (
                <div key={item.id} className="flex gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="mt-1">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={typeConfig.className}>
                        {typeConfig.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-sm text-foreground">{item.message}</p>
                    {item.doctorName && (
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {item.doctorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">Dr. {item.doctorName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No feedback yet</p>
            <p className="text-sm text-muted-foreground/70">Complete exercises to receive feedback</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
