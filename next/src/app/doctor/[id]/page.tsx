'use client'

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/medirehab/header"
import { StatCard } from "@/components/medirehab/stat-card"
import { PatientCard } from "@/components/medirehab/patient-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, ClipboardList, Plus, Search, UserPlus, Send, Trash2, X, LogOut, FileText, Activity } from "lucide-react"

type Patient = {
  patient_id: number
  doctors_patient_id: number
  patient: {
    full_name: string
  }
  notes: string | null
}

type Exercise = {
  exercise_id: number
  exercise: string
  description: string
  image: string
  filepath: string
}

type AssignedExercise = {
  exercise_id: number
  exercise: string
  description: string
  image: string
  filepath: string
  score: number | null
}

type EvaluationResult = {
  result_id: number
  score: number
  feedback?: string
}

type ResultImage = {
  image: string
  filepath: string
}

export default function DoctorDashboard() {
  const params = useParams<{ id: string }>()
  const { id } = params
  const router = useRouter()

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

  // For exercise assignment
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [assignedExercises, setAssignedExercises] = useState<AssignedExercise[]>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("")

  // For notes
  const [patientNotes, setPatientNotes] = useState("")
  const [noteText, setNoteText] = useState("")
  const [savingNote, setSavingNote] = useState(false)

  // For feedback and evaluation
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([])
  const [selectedResultId, setSelectedResultId] = useState<string>("")
  const [feedbackText, setFeedbackText] = useState("")
  const [resultImages, setResultImages] = useState<ResultImage[]>([])
  const [currentResultId, setCurrentResultId] = useState<string>("")

  // Registration form state
  const [regForm, setRegForm] = useState({
    fullName: "",
    birthDate: "",
    gender: "male",
    contact: "",
    email: "",
    address: "",
    profilePic: "",
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
          ...regForm,
          role: "patient",
          doctorId: id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowRegisterForm(false)
        setRegForm({
          fullName: "",
          birthDate: "",
          gender: "male",
          contact: "",
          email: "",
          address: "",
          profilePic: "",
          username: "",
          password: "",
        })
        listPatients()
      }
    } catch (error) {
      console.error("Error registering patient:", error)
    } finally {
      setRegistering(false)
    }
  }

  const removePatient = async (patientId: number) => {
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

  const loadAvailableExercises = async (patientId: number) => {
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

  const loadAssignedExercises = async (patientId: number) => {
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

  const assignExercise = async () => {
    if (!selectedPatient || !selectedExerciseId) return
    try {
      const res = await fetch("/api/doctor/assign_exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.patient_id,
          exerciseId: Number(selectedExerciseId),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowAssignExercise(false)
        setSelectedExerciseId("")
        loadAssignedExercises(selectedPatient.patient_id)
        loadAvailableExercises(selectedPatient.patient_id)
      }
    } catch (error) {
      console.error("Error assigning exercise:", error)
    }
  }

  const removeAssignedExercise = async (exerciseId: number) => {
    if (!selectedPatient) return
    try {
      const res = await fetch("/api/doctor/remove_assigned_exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.patient_id,
          exerciseId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        loadAssignedExercises(selectedPatient.patient_id)
        loadAvailableExercises(selectedPatient.patient_id)
      }
    } catch (error) {
      console.error("Error removing exercise:", error)
    }
  }

  const loadPatientNote = async (doctorsPatientId: number) => {
    try {
      const res = await fetch("/api/doctor/load_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doctorsPatientId }),
      })
      const data = await res.json()
      if (data.success) {
        setPatientNotes(data.note || "")
        setNoteText(data.note || "")
      }
    } catch (error) {
      console.error("Error loading note:", error)
    }
  }

  const updatePatientNote = async () => {
    if (!selectedPatient) return
    setSavingNote(true)
    try {
      const res = await fetch("/api/doctor/update_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPatient.doctors_patient_id,
          note: noteText,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPatientNotes(data.note)
      }
    } catch (error) {
      console.error("Error updating note:", error)
    } finally {
      setSavingNote(false)
    }
  }

  const checkEvaluation = async (exerciseId: number) => {
    if (!selectedPatient) return
    try {
      const res = await fetch("/api/doctor/check_evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.patient_id,
          exerciseId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (data.existing) {
          setShowEvaluation(true)
          setShowPatientDetail(false)
          setResultImages(data.resultImages || [])
          setCurrentResultId(data.resultId || "")
        } else {
          setShowEvaluation(false)
          // Show message that no evaluation exists
          alert("No evaluation results available for this exercise.")
        }
      }
    } catch (error) {
      console.error("Error checking evaluation:", error)
    }
  }

  const sendFeedback = async () => {
    if (!currentResultId || !feedbackText) return
    try {
      const res = await fetch("/api/doctor/send_feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: Number(currentResultId),
          feedback: feedbackText,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowFeedbackForm(false)
        setShowEvaluation(false)
        setFeedbackText("")
        setCurrentResultId("")
        alert("Feedback sent successfully!")
      }
    } catch (error) {
      console.error("Error sending feedback:", error)
    }
  }

  const openPatientDetail = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowPatientDetail(true)
    loadPatientNote(patient.doctors_patient_id)
    loadAssignedExercises(patient.patient_id)
  }

  const openAssignExercise = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowAssignExercise(true)
    loadAvailableExercises(patient.patient_id)
  }

  const logout = () => {
    router.replace('/')
  }

  const filteredPatients = patients.filter((p) => p.patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()))

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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Patients" value={patients.length} icon={<Users className="h-5 w-5" />} />
          <StatCard
            label="Total Exercises"
            value={assignedExercises.length}
            icon={<ClipboardList className="h-5 w-5" />}
          />
          <StatCard
            label="Pending Evaluations"
            value={0} // You can calculate this based on your data
            icon={<Activity className="h-5 w-5" />}
          />
          <StatCard
            label="Patient Notes"
            value={patients.filter(p => p.notes).length}
            icon={<FileText className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">My Patients</h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => setShowRegisterForm(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPatients.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient.patient_id}
                    id={String(patient.patient_id)}
                    name={patient.patient.full_name}
                    notes={patient.notes}
                    onClick={() => openPatientDetail(patient)}
                    onAssignExercise={() => openAssignExercise(patient)}
                    onSendFeedback={() => {
                      setSelectedPatient(patient)
                      setShowFeedbackForm(true)
                      loadAssignedExercises(patient.patient_id)
                    }}
                    onRemove={() => removePatient(patient.patient_id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchQuery ? "No patients found" : "No patients yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try a different search term" : "Start by adding your first patient"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setShowRegisterForm(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Your First Patient
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setShowRegisterForm(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register New Patient
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
          </div>
        </div>
      </main>

      {/* Register Patient Dialog */}
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
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
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
                      value={regForm.birthDate}
                      onChange={(e) => setRegForm({ ...regForm, birthDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={regForm.gender} onValueChange={(value) => setRegForm({ ...regForm, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      value={regForm.contact}
                      onChange={(e) => setRegForm({ ...regForm, contact: e.target.value })}
                      placeholder="09123456789"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="johnkarlcrespo@gmail.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    placeholder="Medical Street 123 Sta. Rosa Manila"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profilePic">Profile Photo</Label>
                  <Input
                    id="profilePic"
                    type="file"
                    onChange={(e) => setRegForm({ ...regForm, profilePic: e.target.value })}
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
                    value={regForm.username}
                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                    placeholder="karljohn123"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Registration Date</Label>
                  <Input
                    value={new Date().toISOString().split("T")[0]}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value="Patient"
                    disabled
                    className="bg-muted"
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

      {/* Assign Exercise Dialog */}
      <Dialog open={showAssignExercise} onOpenChange={setShowAssignExercise}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Exercise</DialogTitle>
            <DialogDescription>Assign an exercise to {selectedPatient?.patient.full_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Exercise</Label>
              <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {availableExercises.map((ex) => (
                    <SelectItem key={ex.exercise_id} value={String(ex.exercise_id)}>
                      {ex.exercise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableExercises.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No exercises available. All exercises may already be assigned.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignExercise(false)}>
              Cancel
            </Button>
            <Button onClick={assignExercise} disabled={!selectedExerciseId}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Exercise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Detail Dialog */}
      <Dialog open={showPatientDetail} onOpenChange={setShowPatientDetail}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          {selectedPatient && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selectedPatient.patient.full_name}</DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removePatient(selectedPatient.patient_id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </DialogHeader>
              <Tabs defaultValue="exercises" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="exercises">Assigned Exercises</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="exercises">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3 pr-4">
                      {assignedExercises.length > 0 ? (
                        assignedExercises.map((ex) => (
                          <Card key={ex.exercise_id}>
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-medium">{ex.exercise}</p>
                                <p className="text-sm text-muted-foreground">{ex.description}</p>
                                {ex.score !== null && (
                                  <Badge variant="outline" className="mt-2">
                                    Score: {ex.score}%
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => checkEvaluation(ex.exercise_id)}>
                                  Check Results
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => removeAssignedExercise(ex.exercise_id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">No exercises assigned yet</div>
                      )}
                    </div>
                  </ScrollArea>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setShowPatientDetail(false)
                      openAssignExercise(selectedPatient)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Exercise
                  </Button>
                </TabsContent>
                <TabsContent value="notes">
                  <div className="space-y-4">
                    {patientNotes && (
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{patientNotes}</p>
                        </CardContent>
                      </Card>
                    )}
                    <div className="space-y-2">
                      <Label>Update Notes</Label>
                      <Textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Write your notes here..."
                        rows={4}
                      />
                      <Button onClick={updatePatientNote} disabled={savingNote}>
                        {savingNote ? "Saving..." : "Save Note"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Evaluation Dialog */}
      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Exercise Evaluation</DialogTitle>
            <DialogDescription>
              Evaluation results for {selectedPatient?.patient.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {resultImages.map((resultImage, index) => (
                <div key={index} className="space-y-2">
                  <Label>Result Image {index + 1}</Label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <img 
                      src={resultImage.image} 
                      alt={`Evaluation result ${index + 1}`}
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback message..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEvaluation(false)}>
                Close
              </Button>
              <Button onClick={sendFeedback} disabled={!feedbackText}>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Feedback Dialog */}
      <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Send feedback for {selectedPatient?.patient.full_name}'s exercise results
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Exercise Result</Label>
              <Select value={selectedResultId} onValueChange={setSelectedResultId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a result to give feedback" />
                </SelectTrigger>
                <SelectContent>
                  {evaluationResults.map((result) => (
                    <SelectItem key={result.result_id} value={String(result.result_id)}>
                      Result ID: {result.result_id} - Score: {result.score}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {evaluationResults.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No evaluation results available. Check a patient's exercise first.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Feedback Message</Label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback message..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
              Cancel
            </Button>
            <Button onClick={sendFeedback} disabled={!selectedResultId || !feedbackText}>
              <Send className="h-4 w-4 mr-2" />
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}