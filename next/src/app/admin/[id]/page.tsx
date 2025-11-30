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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, UserCheck, Plus, Search, MoreHorizontal, Trash2, LogOut, Eye } from "lucide-react"

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
      registration_date: string;
    };
    gender: 'male' | 'female' | 'other' | '';
    contact: string;
    email: string;
    address: string;
    full_name: string;
    birth_date: string;
    account_id: string;
  };
  patient_id: string;
  notes: string | null;
}

interface isVisibleProps {
  dashboard: boolean;
  registerDoctor: boolean;
  doctorList: boolean;
}

export default function AdminDashboard() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [totalPatients, setTotalPatients] = useState(0)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [isVisible, setIsVisible] = useState<isVisibleProps>({dashboard:true, registerDoctor:false, doctorList:false})
  const [isPatientListVisible, setIsPatientListVisible] = useState<boolean>(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [isDoctorDeletionShown, setIsDoctorDeletionShown] = useState<boolean>(false)
  const [havePatients, setHavePatients] = useState<{havePatients: boolean; doctorId?: string}>()
  const [patientDesc, setPatientDesc] = useState<Patient>()

  // Registration form
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
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        fetch("/api/admin/list_patient"),
        fetch("/api/admin/register_doctor"), // GET returns all doctors
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

  const registerDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)
    try {
      const res = await fetch("/api/admin/register_doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...regForm,
          role: "doctor",
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowAddDoctor(false)
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
        fetchData()
        setIsVisible({dashboard:false, registerDoctor:false, doctorList:true})
      } else {
        console.error("Registration failed:", data.message)
      }
    } catch (error) {
      console.error("Error registering doctor:", error)
    } finally {
      setRegistering(false)
    }
  }

  const removeDoctor = async (doctorId: number) => {
    if (!confirm("Are you sure you want to remove this doctor?")) return
    
    try {
      const res = await fetch("/api/admin/remove_doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId }),
      })
      const data = await res.json()
      if (data.success) {
        fetchData()
      } else {
        console.error("Failed to remove doctor:", data.message)
      }
    } catch (error) {
      console.error("Error removing doctor:", error)
    }
  }

  const listPatients = async (visible: boolean, doctorId: string) => {
    const res = await fetch("/api/admin/list_patient", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({doctorId: doctorId})
    })

    const data = await res.json()
    setPatients(data.patients || [])
    setIsPatientListVisible(visible)
  }

  const displayDoctorDeletion = async (doctorId: string, visibility: boolean) => {
    setIsDoctorDeletionShown(visibility)

    const res = await fetch("/api/admin/list_patient", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({doctorId: doctorId})
    })

    const data = await res.json()

    if (data.success) {
      if (!data.patients || data.patients.length < 1) {
        setHavePatients({havePatients: false, doctorId: doctorId})
      } else {
        setHavePatients({havePatients: true, doctorId: doctorId})
      }
    }
  }

  const deleteDoctor = async (doctorId: string) => {
    const res = await fetch("/api/admin/remove_doctor", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({doctorId: doctorId})
    })
    
    const data = await res.json()
    
    if (data.success) {
      fetchData()
      setIsDoctorDeletionShown(false)
    }
  }

  const showPatients = (visible: boolean) => {
    setIsPatientListVisible(visible)
    setPatients([])
  }

  const logout = () => {
    router.replace('/')
  }

  const filteredDoctors = doctors.filter(
    (d) =>
      d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.account?.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="flex justify-center items-center bg-blue-300 w-full h-[70px]">
        <div className="flex justify-between items-center w-[35%]">
          <button 
            className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
            onClick={() => setIsVisible({dashboard:true, registerDoctor:false, doctorList:false})}
          >
            Dashboard
          </button>
          <button 
            className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
            onClick={() => setIsVisible({dashboard:false, registerDoctor:true, doctorList:false})}
          >
            Register Doctor
          </button>
          <button 
            className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
            onClick={() => setIsVisible({dashboard:false, registerDoctor:false, doctorList:true})}
          >
            Registered Doctor List
          </button>
          <button 
            className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      <div className={`${isVisible.dashboard ? 'flex' : 'hidden'} justify-evenly items-center bg-gray-200 w-full h-full`}>
        <span className="flex flex-col justify-evenly items-center h-[300px] w-[300px]">
          <h1 className="flex flex-row justify-center items-center bg-gray-100 h-[200px] w-[200px] rounded-xl text-4xl hover:bg-white hover:cursor-pointer duration-200">
            {totalPatients}
          </h1>
          <h1 className="text-xl">No. of Patients</h1>
        </span>
        <span className="flex flex-col justify-evenly items-center h-[300px] w-[300px]">
          <div className="flex flex-row justify-center items-center bg-gray-100 h-[200px] w-[200px] rounded-xl text-4xl hover:bg-white hover:cursor-pointer duration-200">
            {doctors.length}
          </div>
          <h1 className="text-xl">No. of Doctors</h1>
        </span>
      </div>

      {/* Register Doctor View */}
      <div className={`${isVisible.registerDoctor ? 'flex' : 'hidden'} justify-center items-center bg-gray-200 w-full h-full`}>
        <button 
          className="bg-blue-50 rounded-[100px] w-[100px] h-[100px] border border-blue-50 hover:bg-white hover:border-blue-300 hover:cursor-pointer duration-200" 
          onClick={() => setShowAddDoctor(true)}
        >
          Add
        </button>
      </div>

      {/* Registered Doctor List View */}
      <div className={`${isVisible.doctorList ? 'block' : 'hidden'} bg-gray-200 w-full min-h-screen p-8`}>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle>Doctor Management</CardTitle>
                <CardDescription>
                  {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered in the system
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
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {doctor.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{doctor.full_name}</p>
                              <p className="text-sm text-muted-foreground">{doctor.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                              View Patients
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => displayDoctorDeletion(doctor.doctor_id.toString(), true)}
                            >
                              Unregister
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
                    : "Get started by adding the first healthcare professional to the platform."
                  }
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
      </div>

      {/* Patient List Modal */}
      {patients.length > 0 && (
        <div className={`${isPatientListVisible ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50 z-50`} 
          onClick={() => showPatients(false)}>
          <div className="bg-gray-100 w-[500px] h-[600px] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Patient List</h2>
              <Button variant="outline" onClick={() => showPatients(false)}>Close</Button>
            </div>
            <ScrollArea className="h-[500px]">
              {patients.map(patient => (
                <div key={patient.patient_id} className="flex justify-between items-center bg-blue-200 mb-2 rounded-2xl w-full p-3 hover:bg-blue-100 hover:cursor-pointer duration-200">
                  <h1 className="bg-gray-50 rounded-4xl px-3 py-1">{patient.patient.full_name}</h1>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPatientDesc(patient)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {patientDesc && (
        <div className="flex justify-center items-center fixed inset-0 bg-black/50 z-50" 
          onClick={() => setPatientDesc(undefined)}>
          <div className="flex flex-col justify-start bg-gray-100 rounded-2xl w-[400px] h-[500px] p-4" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-2xl font-bold mb-4">Patient Information</h1>
            <div className="flex flex-row items-center w-full h-[140px] p-2 border-b border-gray-300">
              <div className="h-[100px] w-[100px] rounded-[150px] bg-primary/10 flex items-center justify-center text-primary font-medium text-2xl">
                {patientDesc.patient.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <span className="ml-4 h-fit w-fit">
                <h1 className="text-xl font-bold">{patientDesc.patient.full_name}</h1>
                <h1 className="text-gray-700 capitalize">{patientDesc.patient.gender}</h1>
              </span>
            </div>
            <div className="flex flex-col w-full h-full pt-4 gap-4">
              <div className="flex flex-row">
                <span className="ml-3">
                  <h1 className="text-gray-500 text-[0.8em]">Date of Birth</h1>
                  <h1>{patientDesc.patient.birth_date}</h1>
                </span>
              </div>
              <div className="flex flex-row">
                <span className="ml-3">
                  <h1 className="text-gray-500 text-[0.8em]">Email Address</h1>
                  <h1>{patientDesc.patient.email}</h1>
                </span>
              </div>
              <div className="flex flex-row">
                <span className="ml-3">
                  <h1 className="text-gray-500 text-[0.8em]">Contact Number</h1>
                  <h1>{patientDesc.patient.contact}</h1>
                </span>
              </div>
              <div className="flex flex-row">
                <span className="ml-3">
                  <h1 className="text-gray-500 text-[0.8em]">Address</h1>
                  <h1>{patientDesc.patient.address}</h1>
                </span>
              </div>
              <div className="flex flex-row">
                <span className="ml-3">
                  <h1 className="text-gray-500 text-[0.8em]">Registration Date</h1>
                  <h1>{patientDesc.patient.account.registration_date}</h1>
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setPatientDesc(undefined)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Deletion Confirmation Modal */}
      <div className={`${isDoctorDeletionShown ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50 z-50`}>
        {!havePatients?.havePatients ? 
          <div className="flex flex-col justify-center items-center bg-gray-100 w-[400px] h-[200px] rounded-2xl p-6">
            <p className="mb-5 text-center">Are you sure you want to unregister this doctor?</p>
            <div className="flex flex-row justify-evenly items-center w-full h-fit gap-4">
              <Button 
                className="bg-green-500 hover:bg-green-400 text-white w-[100px]" 
                onClick={() => deleteDoctor(havePatients?.doctorId ?? '')}
              >
                Yes
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-400 text-white w-[100px]" 
                onClick={() => setIsDoctorDeletionShown(false)}
              >
                No
              </Button>
            </div>
          </div> :
          <div className="flex flex-col justify-center items-center bg-gray-100 w-[400px] h-[200px] rounded-2xl p-6">
            <p className="mb-5 text-center">Doctor has patients, cannot be unregistered.</p>
            <Button 
              className="bg-green-500 hover:bg-green-400 text-white w-[100px]" 
              onClick={() => setIsDoctorDeletionShown(false)}
            >
              Okay
            </Button>
          </div>
        }
      </div>

      {/* Add Doctor Dialog */}
      <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Doctor</DialogTitle>
            <DialogDescription>
              Add a new healthcare professional to the platform. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={registerDoctor} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
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
                      value={regForm.birthDate}
                      onChange={(e) => setRegForm({ ...regForm, birthDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={regForm.gender}
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    >
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
                      value={regForm.contact}
                      onChange={(e) => setRegForm({ ...regForm, contact: e.target.value })}
                      placeholder="+1 (555) 000-0000"
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
                      placeholder="doctor@medirehab.com"
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
                    placeholder="Enter complete address"
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
                    placeholder="jsmith"
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
                    value="Doctor"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddDoctor(false)}
                disabled={registering}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={registering}>
                {registering ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  "Register Doctor"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}