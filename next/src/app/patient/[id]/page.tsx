"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/medirehab/header"
import { StatCard } from "@/components/medirehab/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Camera, Play, Info, Award, Calendar, CheckCircle, Clock } from "lucide-react"
import CameraFeed from "@/features/CameraFeed"

interface AssignedExercise {
  id: string
  resultId: string
  assignId: string
  exercise: string
  description: string
  image: string
  filepath: string
  score: number | null
}

interface ActivatedExercise {
  id: string
  resultId: string
  assignId: string
  nameConventions: {
    exercise: string
    snakeName: string
  }
  dataPoints: number[]
  label: string
  parts: string[]
}

export default function PatientDashboard() {
  const params = useParams<{ id: string }>()
  const { id } = params
  const router = useRouter()

  const [recordMode, setRecordMode] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [description, setDescription] = useState("")
  const [score, setScore] = useState(0)
  const [assignedExercises, setAssignedExercises] = useState<AssignedExercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<ActivatedExercise | undefined>()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("Patient")

  const exercises: Omit<ActivatedExercise, "resultId" | "assignId">[] = [
    {
      id: "1",
      nameConventions: { exercise: "Side Arms Raise", snakeName: "side_arms_raise" },
      dataPoints: [11, 12, 13, 14, 23, 24],
      label: "SIDE ARMS RAISE HOLD",
      parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_HIP", "RIGHT_HIP"],
    },
    {
      id: "2",
      nameConventions: { exercise: "Calf Raise", snakeName: "calf_raise" },
      dataPoints: [25, 26, 27, 28, 29, 30],
      label: "CALF RAISE HOLD",
      parts: ["LEFT_KNEE", "RIGHT_KNEE", "LEFT_ANKLE", "RIGHT_ANKLE", "LEFT_HEEL", "RIGHT_HEEL"],
    },
    {
      id: "3",
      nameConventions: { exercise: "Chest Squeeze", snakeName: "chest_squeeze" },
      dataPoints: [11, 12, 13, 14, 15, 16, 23, 24],
      label: "CHEST SQUEEZE HOLD",
      parts: [
        "LEFT_SHOULDER",
        "RIGHT_SHOULDER",
        "LEFT_ELBOW",
        "RIGHT_ELBOW",
        "LEFT_WRIST",
        "RIGHT_WRIST",
        "LEFT_HIP",
        "RIGHT_HIP",
      ],
    },
    {
      id: "4",
      nameConventions: { exercise: "Front Arms Raise", snakeName: "front_arms_raise" },
      dataPoints: [11, 12, 13, 14, 23, 24],
      label: "FRONT ARMS RAISE HOLD",
      parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_HIP", "RIGHT_HIP"],
    },
    {
      id: "5",
      nameConventions: { exercise: "Squat", snakeName: "squat" },
      dataPoints: [11, 12, 23, 24, 25, 26],
      label: "SQUAT HOLD",
      parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_HIP", "RIGHT_HIP", "LEFT_KNEE", "RIGHT_KNEE"],
    },
    {
      id: "6",
      nameConventions: { exercise: "Wall Sit", snakeName: "wall_sit" },
      dataPoints: [11, 12, 13, 14, 23, 24, 25, 26, 27, 28],
      label: "WALL SIT ARM HOLD",
      parts: [
        "LEFT_SHOULDER",
        "RIGHT_SHOULDER",
        "LEFT_ELBOW",
        "RIGHT_ELBOW",
        "LEFT_HIP",
        "RIGHT_HIP",
        "LEFT_KNEE",
        "RIGHT_KNEE",
        "LEFT_ANKLE",
        "RIGHT_ANKLE",
      ],
    },
  ]

  useEffect(() => {
    listAssignedExercises()
    displayName()
  }, [])

  const displayName = async () => {
    try {
      const res = await fetch("/api/display_name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) setName(data.name)
    } catch (error) {
      console.error("Error fetching name:", error)
    }
  }

  const logout = () => {
    router.replace("/")
  }

  const listAssignedExercises = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/patient/load_assigned_exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: id }),
      })
      const data = await res.json()
      if (data.success) setAssignedExercises(data.exercises)
    } catch (error) {
      console.error("Error loading exercises:", error)
    } finally {
      setLoading(false)
    }
  }

  const openDescription = (exercise: AssignedExercise) => {
    setDescription(exercise.description)
    setScore(exercise.score ?? 0)
    setShowDescription(true)

    const fullEx = exercises.find((e) => e.id === exercise.id)
    if (!fullEx) return

    const exWithAssignId: ActivatedExercise = {
      ...fullEx,
      assignId: exercise.assignId,
      resultId: exercise.resultId ?? "0",
    }
    setSelectedExercise(exWithAssignId)
  }

  const openRecord = () => {
    if (!selectedExercise) return
    setShowDescription(false)
    setRecordMode(true)
  }

  const evaluateRecord = async () => {
    const res = await fetch("/api/patient/evaluate_record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exercise: selectedExercise?.nameConventions.snakeName,
        resultId: selectedExercise?.resultId,
      }),
    })

    const data = await res.json()

    if (data.success) {
      setRecordMode(false)
      listAssignedExercises()
    }
  }

  const closeDescription = () => setShowDescription(false)
  const closeRecord = () => setRecordMode(false)

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-muted text-muted-foreground"
    if (score >= 80) return "bg-accent/10 text-accent border-accent/20"
    if (score >= 60) return "bg-chart-3/10 text-chart-3 border-chart-3/20"
    return "bg-destructive/10 text-destructive border-destructive/20"
  }

  const completedExercises = assignedExercises.filter((e) => e.score !== null)
  const pendingExercises = assignedExercises.filter((e) => e.score === null)
  const averageScore =
    completedExercises.length > 0
      ? Math.round(completedExercises.reduce((acc, e) => acc + (e.score || 0), 0) / completedExercises.length)
      : 0

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Patient Dashboard"
        subtitle={`${assignedExercises.length} assigned exercises`}
        userName={name}
        userRole="patient"
        onLogout={logout}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Assigned Exercises"
            value={assignedExercises.length}
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard label="Completed" value={completedExercises.length} icon={<CheckCircle className="h-5 w-5" />} />
          <StatCard label="Average Score" value={`${averageScore}%`} icon={<Award className="h-5 w-5" />} />
          <StatCard label="Pending" value={pendingExercises.length} icon={<Clock className="h-5 w-5" />} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Exercise Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Exercises</CardTitle>
                <CardDescription>
                  {assignedExercises.length} exercise{assignedExercises.length !== 1 ? "s" : ""} assigned by your doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-muted-foreground">Loading exercises...</span>
                  </div>
                ) : assignedExercises.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {assignedExercises.map((exercise) => (
                      <Card
                        key={exercise.assignId}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openDescription(exercise)}
                      >
                        <div className="aspect-video bg-muted overflow-hidden">
                          <img
                            src={exercise.filepath || "/placeholder.svg?height=200&width=300&query=exercise"}
                            alt={exercise.exercise}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{exercise.exercise}</h3>
                          <Badge variant="outline" className={getScoreColor(exercise.score)}>
                            {exercise.score !== null ? `Score: ${exercise.score}%` : "Not completed"}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No exercises assigned</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Your doctor will assign exercises for you to complete. Check back later for your rehabilitation
                      program.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => pendingExercises.length > 0 && openDescription(pendingExercises[0])}
                  disabled={pendingExercises.length === 0}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Next Exercise
                </Button>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="text-sm font-medium">
                    {assignedExercises.length > 0
                      ? Math.round((completedExercises.length / assignedExercises.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${assignedExercises.length > 0 ? (completedExercises.length / assignedExercises.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Best Score</span>
                  <span className="text-sm font-medium">
                    {completedExercises.length > 0 ? Math.max(...completedExercises.map((e) => e.score || 0)) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Exercises Today</span>
                  <span className="text-sm font-medium">{completedExercises.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Exercise Description Dialog */}
      <Dialog open={showDescription} onOpenChange={setShowDescription}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Exercise Instructions
            </DialogTitle>
            <DialogDescription>Detailed instructions for your assigned exercise</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {selectedExercise && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedExercise.nameConventions.exercise}</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Target Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.parts.map((part, index) => (
                        <Badge key={index} variant="outline">
                          {part.replace(/_/g, " ").toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={
                        assignedExercises.find((e) => e.id === selectedExercise.id)?.filepath ||
                        "/placeholder.svg?height=200&width=300&query=exercise" ||
                        "/placeholder.svg"
                      }
                      alt={selectedExercise.nameConventions.exercise}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  {score > 0 && (
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Latest Score</h4>
                      <div className={`text-2xl font-bold px-4 py-2 rounded-full inline-block ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={closeDescription}>
              Close
            </Button>
            <Button onClick={openRecord} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recording Dialog */}
      <Dialog open={recordMode} onOpenChange={setRecordMode}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Recording: {selectedExercise?.nameConventions.exercise}
            </DialogTitle>
            <DialogDescription>Follow the exercise instructions and maintain proper form</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center">
            {selectedExercise && (
              <CameraFeed
                exercise={selectedExercise.nameConventions.snakeName}
                parts={selectedExercise.parts}
                dataPoints={selectedExercise.dataPoints}
                label={selectedExercise.label}
                patientId={id}
                assignId={selectedExercise.assignId}
                resultId={selectedExercise.resultId}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeRecord}>
              Cancel
            </Button>
            <Button onClick={evaluateRecord}>Save Recording</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
