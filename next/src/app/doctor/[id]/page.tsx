'use client'

import Content from "@/features/layout/Content";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type isVisibleProps = {
    dashboard:boolean;
    registerPatient:boolean;
}

const patients = [
            {
                name:"John Xerxes 2",
                birth:"08/14/2004",
                gender:"male",
                contactNumber:"09123456789",
                email:"xerxes@gmail.com",
                address:"3324 jennys avenue rosario pasig city",
                profilePhoto:"xerxes pic",
                registrationDate:"10/26/2025"
            },
            {
                name:"Edwin Squarepants 2",
                birth:"08/14/2004",
                gender:"male",
                contactNumber:"09123456789",
                email:"xerxes@gmail.com",
                address:"3324 jennys avenue rosario pasig city",
                profilePhoto:"xerxes pic",
                registrationDate:"10/26/2025"
            }
        ]

type patientProps = {
    fullName?:string;
    accountId?:string;
    birthDate?:string;
    gender?:string;
    contact?:string;
    email?:string;
    address?:string;
    profilePic?:string;
    username?:string;
    password?:string;
    role?:string;
}

type patientsProps = {
    doctors_patient_id:string;
    patient_id:string;
    patient:{
        full_name:string;
    }
    notes:string;
}

type exerciseProps = {
    exercise_id:string;
    exercise:string;
    description:string;
}

type resultImagesProps = {
    image:string,
    filepath:string
}

export default function Doctor(){

    const params = useParams<{ id:string }>();

    //GET THE DOCTOR ID HERE
    const { id } = params;
    const router = useRouter();
    const [isVisible, setIsVisible] = useState<isVisibleProps>({dashboard:true, registerPatient:false});
    const [showExercises, setShowExercises] = useState<boolean>(false);
    const [exercises, setExercises] = useState<exerciseProps[]>([]);
    const [showNotes, setShowNotes] = useState<boolean>(false);
    const [note, setNote] = useState<string>("");
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
    const [selectedPatient, setSelectedPatient] = useState<string>("");
    const [selectedPatientIdByExercise, setSelectedPatientIdByExercise] = useState<string>("");
    const [showTasks, setShowTasks] = useState<boolean>(false);
    const [assignedTasks, setAssignedTasks] = useState<exerciseProps[]>([]);
    const [showEvaluation, setShowEvaluation] = useState<boolean>(false);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState<boolean>(false);
    const [patients, setPatients] = useState<patientsProps[]>([]);
    const [patient, setPatient] = useState<patientProps>({role:"patient"});
    const [resultImages, setResultImages] = useState<resultImagesProps[]>();

    const logout = () => {
        router.replace('/');
    }

    const listPatients = async () => {
            const res = await fetch("/api/doctor/list_patient",{
                method:'POST',
                headers:{"Content-Type": 'application/json'},
                body: JSON.stringify({id:id})
            });

            const data = await res.json();

            if (data.success){
                setPatients(data.patients);
            }else{
                setPatients([]);
            }
        }

    useEffect(() => {
        listPatients();
    },[]);
    
    const loadExercises = async (patientId:string) => {
        const res = await fetch("/api/doctor/load_exercises",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({patientId:patientId})
        });
        const data = await res.json();

        if(data.success){
            setExercises(data.exercises);
        }
    }

    const assignExercise = async (patientId:string, exerciseId:string) => {
        const res = await fetch("/api/doctor/assign_exercise",{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({patientId:patientId,exerciseId:exerciseId})
        });

        const data = await res.json();

        if(data.success){
            loadExercises(patientId);
        }
    }

    const loadAssignedExercise = async(patientId:string) => {
        const res = await fetch("/api/doctor/load_assigned_exercise",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({patientId:patientId})
        });

        const data = await res.json();

        if(data.success){
            setAssignedTasks(data.exercises);
        }
    }

    const registerPatient = async (e:FormEvent) => {
            e.preventDefault();
            try{
                const res = await fetch("/api/doctor/register_patient", {
                    method: "POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({...patient, doctorId:id})
                })
                const data = await res.json();
    
                if (data.success) {
                    setIsDescriptionVisible(false);
                    listPatients();
                } else{
                    console.log("there is problem in patient registration!");
                }
            }catch(err){
                console.error(err);  
            }
        };

        const loadNote = async (visibility:boolean, id:string) => {
            const res = await fetch("/api/doctor/load_note", {
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({id:id})
            });
            const data = await res.json();

            if (data.success){
                setNote(data.note);
            }else{
                setNote("");
            }

            setShowNotes(visibility);
        } 
        
        const updateNote = async (id:string, note:string) => {
            const res = await fetch("/api/doctor/update_note", {
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({id:id,note:note})
            });

            const data = await res.json();

            if (data.success){
                setNote(data.note);
            }else{
                setNote("");
            }
        }

        const removePatient = async (patientId:string) => {
            const res = await fetch("/api/doctor/remove_patient",{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({patientId:patientId, doctorId:id})
            })
            const data = await res.json();

            if(data.success){
                setPatients(data.patients);
            }
            console.log(data.message);
        }

        const removeTask = async (patientId:string, exerciseId:string) => {
            const res = await fetch("/api/doctor/remove_assigned_exercise", {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({patientId:patientId,exerciseId:exerciseId})
            });

            const data = await res.json();

            if(data.success){
                loadAssignedExercise(patientId);
            }
        };

        const checkEvaluation = async (patientId:string, exerciseId:string) => {
            const res = await fetch("/api/doctor/check_evaluation",{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({patientId:patientId,exerciseId:exerciseId})
            });

            const data = await res.json();

            if(data.success) {
                if (data.existing){
                    setShowEvaluation(true);
                    setShowTasks(false);
                    setResultImages(data.resultImages);
                }else {
                    setShowEvaluation(false);
                    setShowTasks(true);
                }
            }
        }

    return (
        <Content className="flex flex-col justify-start items-center bg-white w-sceen h-screen">
            {/* NAVIGATION BAR */}
            <div className="flex justify-center items-center bg-blue-300 w-screen h-[70px]">
                <div className="flex justify-between items-center w-[22%] ">
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => {
                        listPatients();
                        setIsVisible({dashboard:true, registerPatient:false});
                        }}>
                        Dashboard
                    </button>
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => setIsVisible({dashboard:false, registerPatient:true})}>
                        Register Patient
                    </button>
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => logout()}>
                        Logout
                    </button>
                </div>
            </div>

            {/* DASHBOARD */}
            <div className={`${isVisible['dashboard'] ? 'flex' : 'hidden'} justify-center items-center w-full h-full bg-white`}>
                <div className="flex flex-col items-center w-[800px] h-[90%] bg-blue-50 rounded-2xl shadow-xl">
                    <h1 className="flex justify-start items-center w-full h-[50px] bg-gray-50 rounded-tl-2xl rounded-tr-2xl pl-5 text-xl font-bold">
                        Patient List
                    </h1>
                    <div className="flex flex-col items-center w-full h-full p-5">
                        {patients.map(patient => 
                        <div key={patient.patient_id} className="flex justify-between items-center p-3 w-full h-[50px] bg-blue-200 rounded-4xl mb-2 hover:bg-blue-100 cursor-pointer duration-200"
                        onClick={() => {
                            setSelectedPatientIdByExercise(patient['patient_id']);
                            loadAssignedExercise(patient.patient_id);
                            setShowTasks(true);
                            }}>
                            <h1>{patient['patient']['full_name']}</h1>
                            <span className="flex items-center gap-2">
                                <button className="text-[0.7em] bg-gray-200 rounded-4xl w-[50px] h-[30px] hover:bg-gray-100 cursor-pointer duration-200" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPatient(patient.doctors_patient_id);
                                    loadNote(true, patient.doctors_patient_id);
                                    }}>
                                    Notes
                                </button>
                                <button className="text-[0.9em] bg-gray-100 rounded-4xl p-2 w-[110px] hover:bg-gray-50 cursor-pointer duration-200" 
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setSelectedPatientIdByExercise(patient['patient_id']);
                                    await loadExercises(patient['patient_id']);
                                    setShowExercises(true);
                                    }}>
                                    Assign Task
                                </button>
                                <button className="text-[0.9em] bg-red-200 rounded-4xl p-2 w-[110px] hover:bg-red-100 cursor-pointer duration-200" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removePatient(patient['patient_id']);
                                    }}>
                                    Remove
                                </button>
                            </span>
                        </div>
                        )}
                    </div>

                    <div className={`${showTasks ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50`}>
                        <div className="flex flex-col bg-gray-50 w-[500px] h-[400px] p-4 rounded-2xl">
                            <span className="flex w-full flex-row justify-between items-center pl-2 pr-2">
                                <h1 className="text-xl font-bold">Tasks</h1>
                                <button className="bg-red-500 rounded-4xl text-red-500 text-[0.7em] cursor-pointer hover:bg-red-400 hover:text-red-400 w-[18px] h-[18px]" 
                                onClick={() => setShowTasks(false)}>
                                </button>
                            </span>
                            <div className="w-full h-full bg-blue-50 rounded-2xl mt-2 p-4">
                                {/* Make this dynamically append inside this div */}
                                {assignedTasks.map(exercise => 
                                    <div className="flex justify-between items-center w-full h-[50px] bg-gray-300 rounded-4xl p-4 hover:bg-gray-200 cursor-pointer duration-200 mb-2">
                                    <h1 className="">{exercise['exercise']}</h1>
                                    <span className="flex flex-row items-center gap-2 text-[0.8em]">
                                        <button className="bg-green-400 text-white p-1 pl-3 pr-3 rounded-2xl cursor-pointer hover:bg-green-300 duration-200" 
                                        onClick={() => {
                                            checkEvaluation(selectedPatientIdByExercise, exercise['exercise_id']);
                                            }}>
                                            Evaluation
                                        </button>
                                        <button className="bg-red-400 text-white p-1 pl-3 pr-3 rounded-2xl cursor-pointer hover:bg-red-300 duration-200" 
                                        onClick={() => removeTask(selectedPatientIdByExercise, exercise['exercise_id'])}>
                                            Remove
                                        </button>
                                    </span>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${showEvaluation ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50`}>
                        <div className="flex flex-col bg-gray-50 w-[1000px] h-[700px] p-4 rounded-2xl">
                            <span className="flex w-full flex-row justify-between items-center pl-2 pr-2">
                                <h1 className="text-xl font-bold">Evaluation</h1>
                                <button className="bg-red-500 rounded-4xl text-red-500 text-[0.7em] cursor-pointer hover:bg-red-400 hover:text-red-400 w-[18px] h-[18px]" 
                                onClick={() => {
                                    setShowTasks(true);
                                    setShowEvaluation(false);
                                    }}>
                                </button>
                            </span>
                            <div className="flex justify-evenly items-center w-full h-[400px] bg-blue-100 rounded-2xl mt-2 p-4 mb-5">
                                {/* Make this dynamically append inside this div */}
                                {resultImages?.map(resultImage => 
                                    <img className="bg-black rounded-2xl w-[250px] h-full" src={resultImage.image}/>
                                )}
                            </div>
                            <h1 className="mb-1 font-bold">Feedback</h1>
                            <textarea className="resize-none rounded-2xl p-2 focus:outline-none border border-gray-300"/>
                            <span className="flex flex-col justify-end items-end w-full mt-3">    
                                <button className="bg-blue-500 text-white rounded-4xl w-[100px] h-[35px] cursor-pointer hover:bg-blue-400 duration-200">Send</button>
                            </span>
                        </div>
                    </div>

                    <div className={`${showNotes ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50`}>
                        <div className="flex flex-col bg-gray-50 w-[500px] h-[400px] p-4 rounded-2xl">
                            <span className="flex w-full flex-row justify-between items-center pl-2 pr-2">
                                <h1 className="text-xl font-bold">Notes</h1>
                                <button className="bg-red-500 rounded-4xl text-red-500 text-[0.7em] cursor-pointer hover:bg-red-400 hover:text-red-400 w-[18px] h-[18px]" 
                                onClick={() => {
                                    setShowNotes(false);
                                    setShowUpdateButton(false);
                                    }}>
                                </button>
                            </span>
                            <textarea className="w-full h-full bg-blue-50 rounded-2xl mt-2 p-4 focus:outline-none resize-none" 
                            value={note} onChange={(e) => setNote(e.target.value)}
                            onFocus={() => setShowUpdateButton(true)}/>
                            <span className={`${showUpdateButton ? 'flex' : 'hidden'} gap-3 mt-3 w-full justify-end items-center`}>
                                <button className="bg-gray-200 rounded-4xl w-[100px] p-2 cursor-pointer hover:bg-gray-100 duration-200" 
                                onClick={() => setShowUpdateButton(false)}>
                                    Cancel
                                </button>
                                <button className="bg-blue-200 rounded-4xl w-[100px] p-2 cursor-pointer hover:bg-blue-100 duration-200" 
                                onClick={() => {
                                    // add a function that update to db here
                                    updateNote(selectedPatient, note);
                                    setShowUpdateButton(false);
                                }}>
                                    Update
                                </button>
                            </span>
                        </div>
                    </div>

                    <div className={`${showExercises ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50`}>
                        <div className="flex flex-col bg-gray-50 w-[500px] h-[400px] p-4 rounded-2xl">
                            <span className="flex w-full flex-row justify-between items-center pl-2 pr-2">
                                <h1 className="text-xl font-bold">Select Exercise</h1>
                                <button className="bg-red-500 rounded-4xl text-red-500 text-[0.7em] cursor-pointer hover:bg-red-400 hover:text-red-400 w-[18px] h-[18px]" 
                                onClick={() => setShowExercises(false)}>
                                </button>
                            </span>
                            <div className="w-full h-full bg-blue-50 rounded-2xl mt-2 p-4">
                                {/* Make this dynamically append inside this div */}
                                {exercises?.map(exercise => 
                                <div className="flex items-center w-full h-[50px] bg-gray-300 rounded-4xl p-4 hover:bg-gray-200 cursor-pointer duration-200 mb-2"
                                onClick={() => assignExercise(selectedPatientIdByExercise, exercise['exercise_id'])}>
                                    <h1 className="">{exercise['exercise']}</h1>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REGISTER PATIENT */}
            <div className={`${isVisible['registerPatient'] ? 'flex' : 'hidden'} justify-center items-center w-full h-full bg-white`}>
                <button className="bg-blue-50 rounded-[100px] w-[100px] h-[100px] border border-blue-50 hover:bg-white hover:border-blue-300 hover:cursor-pointer duration-200" onClick={() => setIsDescriptionVisible(true)}>
                    Add
                </button>
                <div className={`${isDescriptionVisible ? 'flex' : 'hidden'} justify-center items-center w-full h-full inset-0 bg-black/50 absolute`}>
                    <form onSubmit={registerPatient} className="flex flex-col bg-gray-50 w-[700px] h-[650px] rounded-2xl p-6 overflow-y-scroll">
                        <span className="h-[90px] w-fit mb-4">
                            <h1 className="text-2xl mb-2 font-bold">Register New Patient</h1>
                            <h1 className="text-gray-500">Fill in the patient's information below. All fields are required.</h1>
                        </span>
                        <div className="flex flex-col w-full">
                            <h1 className="text-xl mb-4">Personal Information</h1>
                            <span className="flex flex-col h-fit w-full mb-4">
                                <label className="mb-2 text-[0.9em] text-gray-600">Full Name</label>
                                <input onChange={(e) => setPatient({...patient, fullName:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="John Karl Crespo"/>
                            </span>
                            <div className="flex flex-row flex-nowrap gap-4 mb-4">
                                <span className="flex flex-col h-fit w-full">
                                    <label className="mb-2 text-[0.9em] text-gray-600">Date of Birth</label>
                                    <input onChange={(e) => setPatient({...patient, birthDate:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" type="date"/>
                                </span>
                                <span className="flex flex-col h-fit w-full">
                                    <label className="mb-2 text-[0.9em] text-gray-600">Gender</label>
                                    <select onChange={(e) => setPatient({...patient, gender:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400">
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </span>
                            </div>
                            <div className="flex flex-row flex-nowrap gap-4 mb-4">
                                <span className="flex flex-col h-fit w-full">
                                    <label className="mb-2 text-[0.9em] text-gray-600">Contact Number</label>
                                    <input onChange={(e) => setPatient({...patient, contact:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="09123456789" required/>
                                </span>
                                <span className="flex flex-col h-fit w-full">
                                    <label className="mb-2 text-[0.9em] text-gray-600">Email Adress</label>
                                    <input onChange={(e) => setPatient({...patient, email:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="johnkarlcrespo@gmail.com" required/>
                                </span>
                            </div>
                            <span className="flex flex-col h-fit w-full mb-4">
                                <label className="mb-2 text-[0.9em] text-gray-600">Address</label>
                                <input onChange={(e) => setPatient({...patient, address:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="Medical Street 123 Sta. Rosa Manila" required/>
                            </span>
                            <span className="flex flex-col h-fit w-full mb-4">
                                <label className="mb-2 text-[0.9em] text-gray-600">Profile Photo</label>
                                <input onChange={(e) => setPatient({...patient, profilePic:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" type="file" required/>
                            </span>
                            <div className="w-full border-t border-gray-300 pt-5">
                                <h1 className="text-xl mb-4">Account Information</h1>

                                <div className="flex flex-row flex-nowrap gap-4 mb-4">
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Username</label>
                                        <input onChange={(e) => setPatient({...patient, username:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="karljohn123" required/>
                                    </span>
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Password</label>
                                        <input onChange={(e) => setPatient({...patient, password:e.target.value})} className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="password123" type="password" required/>
                                    </span>
                                </div>
                                <div className="flex flex-row flex-nowrap gap-4 mb-4">
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Registration Date</label>
                                        <input className="bg-gray-100 border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" type="date" value={`${new Date().toISOString().split("T")[0]}`} disabled required/>
                                    </span>
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Role</label>
                                        <input className="bg-gray-100 border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="Role" value="Patient" disabled required/>
                                    </span>
                                </div>
                                <div className="flex flex-row justify-end items-center w-full h-fit gap-4">
                                    <input className="border border-gray-300 rounded-xl p-3 text-gray-700 text-[0.9em] w-[80px] hover:bg-blue-400 hover:text-white hover:cursor-pointer duration-200" value="Cancel" 
                                    onClick={() => setIsDescriptionVisible(false)} type="button"/>
                                    <button type="submit" className="border border-gray-300 rounded-xl p-3 text-white text-[0.9em] w-[130px] bg-blue-400 hover:bg-blue-300 hover:cursor-pointer duration-200">
                                        Register Patient
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Content>
    );
}