'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, MessageSquare, ClipboardList, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface PatientCardProps {
  id: string
  name: string
  email?: string
  avatar?: string
  exerciseCount?: number
  averageScore?: number
  lastActive?: string
  status?: "active" | "inactive" | "new"
  onClick?: () => void
  onAssignExercise?: () => void
  onViewProgress?: () => void
  onSendFeedback?: () => void
  className?: string
}

export function PatientCard({
  id,
  name,
  email,
  avatar,
  exerciseCount = 0,
  averageScore = 0,
  lastActive,
  status = "active",
  onClick,
  onAssignExercise,
  onViewProgress,
  onSendFeedback,
  className,
}: PatientCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const statusConfig = {
    active: { label: "Active", className: "bg-accent/10 text-accent border-accent/20" },
    inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
    new: { label: "New", className: "bg-primary/10 text-primary border-primary/20" },
  }

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md cursor-pointer", className)} onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onViewProgress?.()
                }}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onAssignExercise?.()
                }}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Assign Exercise
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onSendFeedback?.()
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Feedback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={statusConfig[status].className}>
            {statusConfig[status].label}
          </Badge>
          {lastActive && <span className="text-xs text-muted-foreground">Last active: {lastActive}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Exercises</p>
            <p className="text-lg font-semibold text-foreground">{exerciseCount}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg Score</p>
            <p className="text-lg font-semibold text-foreground">{averageScore}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{averageScore}%</span>
          </div>
          <Progress value={averageScore} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
