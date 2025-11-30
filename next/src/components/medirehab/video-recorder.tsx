'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Video, VideoOff, Camera, Square, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoRecorderProps {
  exerciseName: string
  onClose?: () => void
  onSave?: (videoData: Blob) => void
  className?: string
}

export function VideoRecorder({ exerciseName, onClose, onSave, className }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<{
    score: number
    feedback: string[]
    status: "analyzing" | "complete" | "error"
  } | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setAnalysisResult(null)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // Simulate analysis
    setAnalysisResult({ score: 0, feedback: [], status: "analyzing" })
    setTimeout(() => {
      setAnalysisResult({
        score: 85,
        feedback: [
          "Good posture maintained throughout the exercise",
          "Slightly improve elbow extension on the downward motion",
          "Breathing rhythm is consistent",
        ],
        status: "complete",
      })
    }, 2000)
  }

  return (
    <Card className={cn("w-full max-w-4xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-xl">Record Exercise</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{exerciseName}</p>
        </div>
        <div className="flex items-center gap-2">
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white mr-2" />
              Recording {formatTime(recordingTime)}
            </Badge>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <VideoOff className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-3 gap-0">
          {/* Video Feed */}
          <div className="lg:col-span-2 bg-black aspect-video relative flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-lg" />
            <div className="text-center text-white/60">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Camera feed will appear here</p>
              <p className="text-sm mt-2">Position yourself within the frame</p>
            </div>

            {/* Pose overlay hint */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <Badge variant="secondary" className="bg-white/10 text-white border-0">
                <CheckCircle2 className="h-3 w-3 mr-1 text-accent" />
                Body detected
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-0">
                MediaPipe Active
              </Badge>
            </div>
          </div>

          {/* Controls & Analysis */}
          <div className="p-6 border-l bg-card">
            <div className="space-y-6">
              {/* Recording Controls */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Recording Controls</h4>
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button onClick={handleStartRecording} className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={handleStopRecording} variant="destructive" className="flex-1">
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>

              {/* Real-time Metrics */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Real-time Analysis</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Form Accuracy</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Range of Motion</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Timing</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Analysis Result */}
              {analysisResult && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Analysis Result</h4>
                  {analysisResult.status === "analyzing" ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Analyzing your performance...
                    </div>
                  ) : analysisResult.status === "complete" ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                        <div className="text-2xl font-bold text-accent">{analysisResult.score}%</div>
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                      </div>
                      <div className="space-y-2">
                        {analysisResult.feedback.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit for Review
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      Analysis failed. Please try again.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
