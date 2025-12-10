"use client"

import type React from "react"
import { useRouter } from "next/navigation"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Eye, Users, UserPlus, Activity, Stethoscope, LayoutDashboard } from "lucide-react"

interface Doctor {
  doctor_id: number
  full_name: string
  email: string
  contact: string
  account: {
    username: string
  }
}

interface Patient {
  patient: {
    account: {
      registration_date: string
    }
    gender: "male" | "female" | "other" | ""
    contact: string
    email: string
    address: string
    full_name: string
    birth_date: string
    account_id: string
  }
  patient_id: string
  notes: string | null
}

export default function AdminDashboard() {
  const router = useRouter()

  const [totalPatients, setTotalPatients] = useState(0)
  const [numberOfExercises, setNumberOfExercises] = useState(0)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isPatientListVisible, setIsPatientListVisible] = useState<boolean>(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [isDoctorDeletionShown, setIsDoctorDeletionShown] = useState<boolean>(false)
  const [havePatients, setHavePatients] = useState<{ havePatients: boolean; doctorId?: string }>()
  const [patientDesc, setPatientDesc] = useState<Patient>()
  const [doctor, setDoctor] = useState({
    role: "doctor",
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
    fetchData()
    countExercises()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        fetch("/api/admin/list_patient"),
        fetch("/api/admin/register_doctor"),
      ])

      const patientsData = await patientsRes.json()
      const doctorsData = await doctorsRes.json()

      if (Array.isArray(patientsData)) {
        setTotalPatients(patientsData.length)
      }
      if (Array.isArray(doctorsData)) {
        setDoctors(doctorsData)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const countPatients = async () => {
    const res = await fetch("/api/admin/list_patient")
    const data = await res.json()

    if (data.success) {
      setTotalPatients(data.totalPatients)
    }
  }

  const countExercises = async () => {
    const res = await fetch("/api/admin/count_exercises")
    const data = await res.json()

    if (data.success) {
      setNumberOfExercises(data.numberOfExercises)
    }
  }

  const registerDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)
    try {
      const res = await fetch("/api/admin/register_doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      })
      const data = await res.json()
      if (data.success) {
        setShowAddDoctor(false)
        setDoctor({
          role: "doctor",
          fullname: "",
          birthDate: "",
          gender: "",
          contact: "",
          email: "",
          address: "",
          username: "",
          password: "",
        })
        fetchData()
        setActiveTab("doctors")
      } else {
        console.error("Registration failed:", data.message)
      }
    } catch (error) {
      console.error("Error registering doctor:", error)
    } finally {
      setRegistering(false)
    }
  }

  const listPatients = async (visible: boolean, doctorId: string) => {
    const res = await fetch("/api/admin/list_patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId: doctorId }),
    })

    const data = await res.json()
    setPatients(data.patients || [])
    setIsPatientListVisible(visible)
  }

  const displayDoctorDeletion = async (doctorId: string, visibility: boolean) => {
    setIsDoctorDeletionShown(visibility)

    const res = await fetch("/api/admin/list_patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId: doctorId }),
    })

    const data = await res.json()

    if (data.success) {
      if (!data.patients || data.patients.length < 1) {
        setHavePatients({ havePatients: false, doctorId: doctorId })
      } else {
        setHavePatients({ havePatients: true, doctorId: doctorId })
      }
    }
  }

  const deleteDoctor = async (doctorId: string) => {
    const res = await fetch("/api/admin/remove_doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId: doctorId }),
    })

    const data = await res.json()

    if (data.success) {
      fetchData()
      setIsDoctorDeletionShown(false)
    }
  }

  const logout = () => {
    router.replace("/")
  }

  const filteredDoctors = doctors.filter(
    (d) =>
      d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.account?.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Admin Dashboard"
        subtitle={`Managing ${doctors.length} doctors, ${totalPatients} patients`}
        userName="Administrator"
        userRole="admin"
        onLogout={logout}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Register</span>
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Doctors</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard label="Total Patients" value={totalPatients} icon={<Users className="h-5 w-5" />} />
              <StatCard label="Registered Doctors" value={doctors.length} icon={<Stethoscope className="h-5 w-5" />} />
              <StatCard label="Available Exercises" value={numberOfExercises} icon={<Activity className="h-5 w-5" />} />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={() => setActiveTab("register")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register New Doctor
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("doctors")}>
                  <Users className="h-4 w-4 mr-2" />
                  View All Doctors
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Doctor Tab */}
          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register New Doctor</CardTitle>
                <CardDescription>Add a new healthcare professional to the platform</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-12">
                <Button size="lg" className="h-24 w-24 rounded-full" onClick={() => setShowAddDoctor(true)}>
                  <Plus className="h-8 w-8" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors List Tab */}
          <TabsContent value="doctors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>Doctor Management</CardTitle>
                    <CardDescription>
                      {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered in the system
                    </CardDescription>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search doctors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button onClick={() => setShowAddDoctor(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Doctor
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-muted-foreground">Loading doctors...</span>
                  </div>
                ) : filteredDoctors.length > 0 ? (
                  <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Doctor Information</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="w-[200px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDoctors.map((doctor) => (
                          <TableRow key={doctor.doctor_id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {doctor.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">{doctor.full_name}</p>
                                  <p className="text-sm text-muted-foreground">{doctor.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                @{doctor.account?.username}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{doctor.contact}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => listPatients(true, doctor.doctor_id.toString())}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Patients
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => displayDoctorDeletion(doctor.doctor_id.toString(), true)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? "No doctors found" : "No doctors registered"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      {searchQuery
                        ? "Try adjusting your search terms to find what you're looking for."
                        : "Get started by adding the first healthcare professional to the platform."}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowAddDoctor(true)} size="lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Doctor
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Patient List Dialog */}
      <Dialog open={isPatientListVisible} onOpenChange={setIsPatientListVisible}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient List</DialogTitle>
            <DialogDescription>Patients assigned to this doctor</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            {patients.length > 0 ? (
              <div className="space-y-2">
                {patients.map((patient) => (
                  <div
                    key={patient.patient_id}
                    className="flex justify-between items-center p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
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
                    <Button variant="outline" size="sm" onClick={() => setPatientDesc(patient)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No patients assigned to this doctor</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={!!patientDesc} onOpenChange={() => setPatientDesc(undefined)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Information</DialogTitle>
          </DialogHeader>
          {patientDesc && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {patientDesc.patient.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{patientDesc.patient.full_name}</h3>
                  <p className="text-muted-foreground capitalize">{patientDesc.patient.gender}</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{patientDesc.patient.birth_date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{patientDesc.patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p className="font-medium">{patientDesc.patient.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{patientDesc.patient.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{patientDesc.patient.account.registration_date}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setPatientDesc(undefined)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor Deletion Confirmation Dialog */}
      <Dialog open={isDoctorDeletionShown} onOpenChange={setIsDoctorDeletionShown}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{havePatients?.havePatients ? "Cannot Remove Doctor" : "Confirm Removal"}</DialogTitle>
            <DialogDescription>
              {havePatients?.havePatients
                ? "This doctor has patients assigned. Please reassign or remove the patients first."
                : "Are you sure you want to remove this doctor from the system?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDoctorDeletionShown(false)}>
              Cancel
            </Button>
            {!havePatients?.havePatients && (
              <Button
                variant="destructive"
                onClick={() => havePatients?.doctorId && deleteDoctor(havePatients.doctorId)}
              >
                Remove Doctor
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Doctor Dialog */}
      <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Doctor</DialogTitle>
            <DialogDescription>Fill in the doctor's information below. All fields are required.</DialogDescription>
          </DialogHeader>
          <form onSubmit={registerDoctor} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={doctor.fullname}
                    onChange={(e) => setDoctor({ ...doctor, fullname: e.target.value })}
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date of Birth</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={doctor.birthDate}
                      onChange={(e) => setDoctor({ ...doctor, birthDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={doctor.gender}
                      onChange={(e) => setDoctor({ ...doctor, gender: e.target.value })}
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
                      value={doctor.contact}
                      onChange={(e) => setDoctor({ ...doctor, contact: e.target.value })}
                      placeholder="09123456789"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={doctor.email}
                      onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={doctor.address}
                    onChange={(e) => setDoctor({ ...doctor, address: e.target.value })}
                    placeholder="123 Medical Center, City"
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
                    value={doctor.username}
                    onChange={(e) => setDoctor({ ...doctor, username: e.target.value })}
                    placeholder="drsmith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={doctor.password}
                    onChange={(e) => setDoctor({ ...doctor, password: e.target.value })}
                    placeholder="Create a secure password"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDoctor(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={registering}>
                {registering ? "Registering..." : "Register Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
