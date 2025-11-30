'use client'

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/medirehab/header"
import { StatCard } from "@/components/medirehab/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, LogOut, Play, Info, Award, Calendar } from "lucide-react"
import CameraFeed from "@/features/CameraFeed"

interface AssignedExercise {
  id: string
  exercise: string
  description: string
  image: string
  filepath: string
  score: number | null
}

interface ActivatedExercise {
  id: string
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
  const [selectedExercise, setSelectedExercise] = useState<ActivatedExercise>()
  const [loading, setLoading] = useState(true)

  const exercises: ActivatedExercise[] = [
    { id: "1", nameConventions: { exercise: "side arms raise", snakeName: "side_arms_raise" }, dataPoints: [11, 12, 13, 14, 23, 24], label: "SIDE ARMS RAISE HOLD", parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_HIP", "RIGHT_HIP"] },
    { id: "2", nameConventions: { exercise: "calf raise", snakeName: "calf_raise" }, dataPoints: [25, 26, 27, 28, 29, 30], label: "CALF RAISE HOLD", parts: ["LEFT_KNEE", "RIGHT_KNEE", "LEFT_ANKLE", "RIGHT_ANKLE", "LEFT_HEEL", "RIGHT_HEEL"] },
    { id: "3", nameConventions: { exercise: "chest squeeze", snakeName: "chest_squeeze" }, dataPoints: [11, 12, 13, 14, 15, 16, 23, 24], label: "CHEST SQUEEZE HOLD", parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_WRIST", "RIGHT_WRIST", "LEFT_HIP", "RIGHT_HIP"] },
    { id: "4", nameConventions: { exercise: "front arms raise", snakeName: "front_arms_raise" }, dataPoints: [11, 12, 13, 14, 23, 24], label: "FRONT ARMS RAISE HOLD", parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_HIP", "RIGHT_HIP"] },
    { id: "5", nameConventions: { exercise: "squat", snakeName: "squat" }, dataPoints: [11, 12, 23, 24, 25, 26], label: "SQUAT HOLD", parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_HIP", "RIGHT_HIP", "LEFT_KNEE", "RIGHT_KNEE"] },
    { id: "6", nameConventions: { exercise: "wall sit", snakeName: "wall_sit" }, dataPoints: [11, 12, 13, 14, 23, 24, 25, 26, 27, 28], label: "WALL SIT ARM HOLD", parts: ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_HIP", "RIGHT_HIP", "LEFT_KNEE", "RIGHT_KNEE", "LEFT_ANKLE", "RIGHT_ANKLE"] }
  ]

  useEffect(() => {
    listAssignedExercises()
  }, [])

  const logout = () => {
    router.replace("/")
  }

  const listAssignedExercises = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/patient/load_assigned_exercise", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: id })
      })
      const data = await res.json()
      if (data.success) setAssignedExercises(data.exercises)
    } catch (error) {
      console.error("Error loading exercises:", error)
    } finally {
      setLoading(false)
    }
  }

  const openDescription = (exercise: AssignedExercise, exerciseId: string) => {
    setDescription(exercise.description)
    setScore(exercise.score ?? 0)
    setShowDescription(true)

    console.log(exerciseId)
    const fullEx = exercises.find(e => e.id === exerciseId.toString())
    setSelectedExercise(fullEx)
  }

  const openRecord = () => {
    if (!selectedExercise) return
    setShowDescription(false)
    setRecordMode(true)
  }

  const saveRecord = () => {
    // TODO: IMPLEMENT THIS FEATURE
    console.log("Saving recording...")
  }

  const closeDescription = () => setShowDescription(false)
  const closeRecord = () => setRecordMode(false)

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Patient Dashboard"
        subtitle={`${assignedExercises.length} assigned exercises`}
        userName="Patient"
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
          <StatCard
            label="Completed Sessions"
            value={assignedExercises.filter(e => e.score !== null).length}
            icon={<Award className="h-5 w-5" />}
          />
          <StatCard
            label="Average Score"
            value={
              assignedExercises.filter(e => e.score !== null).length > 0
                ? Math.round(
                  assignedExercises
                    .filter(e => e.score !== null)
                    .reduce((acc, e) => acc + (e.score || 0), 0) /
                  assignedExercises.filter(e => e.score !== null).length
                )
                : 0
            }
            icon={<Award className="h-5 w-5" />}
          />
          <StatCard
            label="Pending Exercises"
            value={assignedExercises.filter(e => e.score === null).length}
            icon={<Play className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Exercise Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>My Exercises</CardTitle>
                    <CardDescription>
                      {assignedExercises.length} exercise{assignedExercises.length !== 1 ? 's' : ''} assigned by your doctor
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-muted-foreground">Loading exercises...</span>
                  </div>
                ) : assignedExercises.length > 0 ? (
                  <div className="flex flex-wrap justify-start items-start w-full gap-5">
                    {assignedExercises.map((exercise, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col justify-center items-center bg-blue-200 h-[300px] w-[283px] gap-5 rounded-4xl hover:cursor-pointer hover:bg-blue-100 duration-200 p-4"
                        onClick={() => openDescription(exercise, exercise.id)}
                      >
                        <img 
                          src={exercise.image || "/placeholder-exercise.jpg"} 
                          alt={exercise.exercise}
                          className="w-full h-[200px] object-cover rounded-2xl"
                        />
                        <h1 className="flex flex-nowrap justify-center w-full text-lg font-semibold text-center">
                          {exercise.exercise}
                        </h1>
                        {exercise.score !== null && (
                          <div className={`text-white rounded-xl p-2 w-[100px] text-xl text-center ${getScoreColor(exercise.score)}`}>
                            {exercise.score}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No exercises assigned
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Your doctor will assign exercises for you to complete. Check back later for your rehabilitation program.
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
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => assignedExercises.length > 0 && openDescription(assignedExercises[0], assignedExercises[0].id)}
                  disabled={assignedExercises.length === 0}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Latest Exercise
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="text-sm font-medium">
                    {assignedExercises.length > 0
                      ? Math.round((assignedExercises.filter(e => e.score !== null).length / assignedExercises.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Best Score</span>
                  <span className="text-sm font-medium">
                    {assignedExercises.length > 0
                      ? Math.max(...assignedExercises.filter(e => e.score !== null).map(e => e.score || 0))
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sessions Today</span>
                  <span className="text-sm font-medium">0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Exercise Description Dialog */}
      <Dialog open={showDescription} onOpenChange={setShowDescription}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Exercise Instructions
            </DialogTitle>
            <DialogDescription>
              Detailed instructions for your assigned exercise
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {selectedExercise && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          {part.replace(/_/g, ' ').toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={assignedExercises.find(e => e.id === selectedExercise.id)?.image || "/placeholder-exercise.jpg"}
                      alt={selectedExercise.nameConventions.exercise}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  {score > 0 && (
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Latest Score</h4>
                      <div className={`text-2xl font-bold ${getScoreColor(score)} px-4 py-2 rounded-full inline-block`}>
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
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Exercise Recording
            </DialogTitle>
            <DialogDescription>
              Record your exercise session for evaluation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedExercise && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-semibold mb-2">{selectedExercise.label}</h4>
                <p className="text-sm text-muted-foreground">
                  Follow the exercise instructions and ensure proper form during recording.
                </p>
              </div>
            )}
            <div className="border rounded-lg p-4 bg-black/5 min-h-[400px] flex items-center justify-center">
              {selectedExercise ? (
                <CameraFeed 
                  exercise={selectedExercise.nameConventions.snakeName} 
                  parts={selectedExercise.parts}
                  dataPoints={selectedExercise.dataPoints} 
                  label={selectedExercise.label} 
                />
              ) : (
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No exercise selected</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={closeRecord}>
              Cancel
            </Button>
            <Button onClick={saveRecord} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Save Recording
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}