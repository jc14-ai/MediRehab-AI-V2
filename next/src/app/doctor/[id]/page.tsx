"use client"

import type React from "react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/medirehab/header"
import { StatCard } from "@/components/medirehab/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  ClipboardList,
  Plus,
  Search,
  UserPlus,
  Trash2,
  FileText,
  Activity,
  LayoutDashboard,
  Eye,
  Send,
  X,
} from "lucide-react"

interface Patient {
  patient_id: string
  doctors_patient_id: string
  patient: {
    full_name: string
  }
  notes: string | null
}

interface Exercise {
  exercise_id: number
  exercise: string
  description: string
  image: string
  filepath: string
}

interface AssignedExercise {
  exercise_id: number
  exercise: string
  description: string
  image: string
  filepath: string
  score: number | null
}

interface ResultImage {
  image: string
  filepath: string
}

export default function DoctorDashboard() {
  const params = useParams<{ id: string }>()
  const { id } = params
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("dashboard")
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showAssignExercise, setShowAssignExercise] = useState(false)
  const [showPatientDetail, setShowPatientDetail] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [name, setName] = useState("Doctor")
  const [loading, setLoading] = useState(true)

  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [assignedExercises, setAssignedExercises] = useState<AssignedExercise[]>([])
  const [selectedPatientIdByExercise, setSelectedPatientIdByExercise] = useState<string>("")

  const [patientNotes, setPatientNotes] = useState("")
  const [noteText, setNoteText] = useState("")
  const [showNotes, setShowNotes] = useState<boolean>(false)
  const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false)
  const [selectedNotePatientId, setSelectedNotePatientId] = useState<string>("")

  const [selectedResultId, setSelectedResultId] = useState<string>("")
  const [feedbackText, setFeedbackText] = useState("")
  const [resultImages, setResultImages] = useState<ResultImage[]>([])
  const [score, setScore] = useState<string>("0")

  const [patient, setPatient] = useState({
    role: "patient",
    fullname: "",
    birthDate: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    username: "",
    password: "",
  })
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    displayName()
    listPatients()
  }, [id])

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

  const listPatients = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/doctor/list_patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) setPatients(data.patients)
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const registerPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)
    try {
      const res = await fetch("/api/doctor/register_patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: patient.fullname,
          birthDate: patient.birthDate,
          gender: patient.gender,
          contact: patient.contact,
          email: patient.email,
          address: patient.address,
          username: patient.username,
          password: patient.password,
          role: patient.role,
          profilePic: "default.png",
          doctorId: id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowRegisterForm(false)
        setPatient({
          role: "patient",
          fullname: "",
          birthDate: "",
          gender: "",
          contact: "",
          email: "",
          address: "",
          username: "",
          password: "",
        })
        listPatients()
        setActiveTab("dashboard")
      }
    } catch (error) {
      console.error("Error registering patient:", error)
    } finally {
      setRegistering(false)
    }
  }

  const removePatient = async (patientId: string) => {
    try {
      const res = await fetch("/api/doctor/remove_patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, doctorId: id }),
      })
      const data = await res.json()
      if (data.success) {
        setPatients(data.patients)
        setShowPatientDetail(false)
        setSelectedPatient(null)
      }
    } catch (error) {
      console.error("Error removing patient:", error)
    }
  }

  const loadExercises = async (patientId: string) => {
    try {
      const res = await fetch("/api/doctor/load_exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      })
      const data = await res.json()
      if (data.success) setAvailableExercises(data.exercises)
    } catch (error) {
      console.error("Error loading exercises:", error)
    }
  }

  const loadAssignedExercise = async (patientId: string) => {
    try {
      const res = await fetch("/api/doctor/load_assigned_exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      })
      const data = await res.json()
      if (data.success) setAssignedExercises(data.exercises)
    } catch (error) {
      console.error("Error loading assigned exercises:", error)
    }
  }

  const assignExercise = async (patientId: string, exerciseId: number) => {
    try {
      const res = await fetch("/api/doctor/assign_exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientId,
          exerciseId: exerciseId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowAssignExercise(false)
        loadAssignedExercise(patientId)
        loadExercises(patientId)
      }
    } catch (error) {
      console.error("Error assigning exercise:", error)
    }
  }

  const removeTask = async (patientId: string, exerciseId: number) => {
    try {
      const res = await fetch("/api/doctor/remove_assigned_exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientId,
          exerciseId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        loadAssignedExercise(patientId)
        loadExercises(patientId)
      }
    } catch (error) {
      console.error("Error removing exercise:", error)
    }
  }

  const loadNote = async (visible: boolean, patientId: string) => {
    try {
      const res = await fetch("/api/doctor/load_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: patientId }),
      })
      const data = await res.json()
      if (data.success) {
        setNoteText(data.note || "")
        setPatientNotes(data.note || "")
      }
    } catch (error) {
      console.error("Error loading note:", error)
    }
    setShowNotes(visible)
    setSelectedNotePatientId(patientId)
  }

  const updateNote = async (patientId: string, note: string) => {
    try {
      const res = await fetch("/api/doctor/update_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: patientId,
          note: note,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPatientNotes(data.note)
      }
    } catch (error) {
      console.error("Error updating note:", error)
    }
    setShowUpdateButton(false)
  }

  const checkEvaluation = async (patientId: string, exerciseId: number) => {
    try {
      const res = await fetch("/api/doctor/check_evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientId,
          exerciseId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (data.existing) {
          setShowEvaluation(true)
          setShowPatientDetail(false)
          setResultImages(data.resultImages || [])
          setScore(data.score || "0")
          setSelectedResultId(data.resultId || "")
        } else {
          setShowEvaluation(false)
        }
      }
    } catch (error) {
      console.error("Error checking evaluation:", error)
    }
  }

  const sendFeedback = async (resultId: string, feedback: string) => {
    try {
      const res = await fetch("/api/doctor/send_feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: Number(resultId),
          feedback: feedback,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowFeedbackForm(false)
        setShowEvaluation(false)
        setFeedbackText("")
        alert("Feedback sent successfully!")
      }
    } catch (error) {
      console.error("Error sending feedback:", error)
    }
  }

  const openPatientDetail = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowPatientDetail(true)
    loadNote(true, patient.doctors_patient_id)
    loadAssignedExercise(patient.patient_id)
  }

  const openAssignExercise = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowAssignExercise(true)
    loadExercises(patient.patient_id)
  }

  const logout = () => {
    router.replace("/")
  }

  const filteredPatients = patients.filter((p) => p.patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-muted text-muted-foreground"
    if (score >= 80) return "bg-accent/10 text-accent"
    if (score >= 60) return "bg-chart-3/10 text-chart-3"
    return "bg-destructive/10 text-destructive"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Doctor Dashboard"
        subtitle={`Managing ${patients.length} patients`}
        userName={name}
        userRole="doctor"
        onLogout={logout}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Register Patient</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard label="Total Patients" value={patients.length} icon={<Users className="h-5 w-5" />} />
              <StatCard
                label="Active Exercises"
                value={assignedExercises.length}
                icon={<Activity className="h-5 w-5" />}
              />
              <StatCard
                label="Completed Today"
                value={assignedExercises.filter((e) => e.score !== null).length}
                icon={<ClipboardList className="h-5 w-5" />}
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>Patient List</CardTitle>
                    <CardDescription>
                      {patients.length} patient{patients.length !== 1 ? "s" : ""} under your care
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-muted-foreground">Loading patients...</span>
                  </div>
                ) : filteredPatients.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.patient_id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer gap-3"
                          onClick={() => openPatientDetail(patient)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {patient.patient.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{patient.patient.full_name}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-13 sm:ml-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                loadNote(true, patient.doctors_patient_id)
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Notes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPatientIdByExercise(patient.patient_id)
                                openAssignExercise(patient)
                              }}
                            >
                              <ClipboardList className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removePatient(patient.patient_id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? "No patients found" : "No patients yet"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      {searchQuery ? "Try adjusting your search terms." : "Start by registering your first patient."}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setActiveTab("register")}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register Patient
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register New Patient</CardTitle>
                <CardDescription>Add a new patient to your care</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-12">
                <Button size="lg" className="h-24 w-24 rounded-full" onClick={() => setShowRegisterForm(true)}>
                  <Plus className="h-8 w-8" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showRegisterForm} onOpenChange={setShowRegisterForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
            <DialogDescription>Fill in the patient's information below. All fields are required.</DialogDescription>
          </DialogHeader>
          <form onSubmit={registerPatient} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={patient.fullname}
                    onChange={(e) => setPatient({ ...patient, fullname: e.target.value })}
                    placeholder="John Karl Crespo"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date of Birth</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={patient.birthDate}
                      onChange={(e) => setPatient({ ...patient, birthDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={patient.gender}
                      onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      value={patient.contact}
                      onChange={(e) => setPatient({ ...patient, contact: e.target.value })}
                      placeholder="09123456789"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patient.email}
                      onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                      placeholder="patient@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={patient.address}
                    onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                    placeholder="123 Street, City"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={patient.username}
                    onChange={(e) => setPatient({ ...patient, username: e.target.value })}
                    placeholder="johndoe123"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={patient.password}
                    onChange={(e) => setPatient({ ...patient, password: e.target.value })}
                    placeholder="Create a secure password"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRegisterForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={registering}>
                {registering ? "Registering..." : "Register Patient"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Patient Notes
            </DialogTitle>
            <DialogDescription>Add or edit notes for this patient</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value)
                setShowUpdateButton(e.target.value !== patientNotes)
              }}
              placeholder="Enter notes about the patient's condition, progress, etc."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotes(false)}>
              Cancel
            </Button>
            {showUpdateButton && (
              <Button onClick={() => updateNote(selectedNotePatientId, noteText)}>Save Notes</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPatientDetail} onOpenChange={setShowPatientDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPatient && (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {selectedPatient.patient.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedPatient.patient.full_name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>View assigned exercises and progress</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Assigned Exercises</h3>
              <Button size="sm" onClick={() => selectedPatient && openAssignExercise(selectedPatient)}>
                <Plus className="h-4 w-4 mr-1" />
                Assign New
              </Button>
            </div>

            {assignedExercises.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {assignedExercises.map((exercise) => (
                    <div
                      key={exercise.exercise_id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                          <img
                            src={exercise.filepath || "/placeholder.svg?height=48&width=48&query=exercise"}
                            alt={exercise.exercise}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{exercise.exercise}</p>
                          <Badge variant="outline" className={getScoreColor(exercise.score)}>
                            {exercise.score !== null ? `Score: ${exercise.score}%` : "Not completed"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {exercise.score !== null && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              selectedPatient && checkEvaluation(selectedPatient.patient_id, exercise.exercise_id)
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            selectedPatient && removeTask(selectedPatient.patient_id, exercise.exercise_id)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No exercises assigned yet</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatientDetail(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAssignExercise} onOpenChange={setShowAssignExercise}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Exercise</DialogTitle>
            <DialogDescription>Select an exercise to assign to {selectedPatient?.patient.full_name}</DialogDescription>
          </DialogHeader>

          {availableExercises.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4">
                {availableExercises.map((exercise) => (
                  <Card
                    key={exercise.exercise_id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => selectedPatient && assignExercise(selectedPatient.patient_id, exercise.exercise_id)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video rounded-lg bg-muted overflow-hidden mb-3">
                        <img
                          src={exercise.filepath || "/placeholder.svg?height=120&width=200&query=exercise"}
                          alt={exercise.exercise}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-sm">{exercise.exercise}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{exercise.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No exercises available to assign</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignExercise(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exercise Evaluation</DialogTitle>
            <DialogDescription>Review the patient's exercise performance</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Performance Score</p>
              <p className="text-4xl font-bold text-primary">{score}%</p>
            </div>

            {resultImages.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recording Screenshots</h4>
                <div className="grid grid-cols-3 gap-2">
                  {resultImages.map((img, index) => (
                    <div key={index} className="aspect-video rounded-lg bg-muted overflow-hidden">
                      <img
                        src={img.filepath || "/placeholder.svg"}
                        alt={`Frame ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEvaluation(false)}>
              Close
            </Button>
            <Button onClick={() => setShowFeedbackForm(true)}>
              <Send className="h-4 w-4 mr-2" />
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>Provide feedback on the patient's performance</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback here..."
              className="min-h-[150px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
              Cancel
            </Button>
            <Button onClick={() => sendFeedback(selectedResultId, feedbackText)} disabled={!feedbackText.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}