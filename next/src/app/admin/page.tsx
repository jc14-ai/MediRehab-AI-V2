'use client'

import Content from "@/features/layout/Content";
import { useState } from "react";

type isVisibleProps = {
    dashboard:boolean;
    registerDoctor:boolean;
    doctorList:boolean;
}

type patient = {
    name:string;
    birth:string;
    gender:string;
    contactNumber:string;
    email:string;
    address:string;
    profilePhoto:string;
    registrationDate:string;
}

// type doctor = {
//     name:string;
//     patients:patient[];
// }

const doctorList = [
    {   
        name:"Karl Crespo",
        patients:[
            {
                name:"John Xerxes",
                birth:"08/14/2004",
                gender:"male",
                contactNumber:"09123456789",
                email:"xerxes@gmail.com",
                address:"3324 jennys avenue rosario pasig city",
                profilePhoto:"xerxes pic",
                registrationDate:"10/26/2025"
            },
            {
                name:"Edwin Squarepants",
                birth:"08/14/2004",
                gender:"male",
                contactNumber:"09123456789",
                email:"xerxes@gmail.com",
                address:"3324 jennys avenue rosario pasig city",
                profilePhoto:"xerxes pic",
                registrationDate:"10/26/2025"
            }
        ]
    },
    {   
        name:"Karl Crespo 2", 
        patients:[
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
    },
    {   
        name:"Karl Crespo 3", 
        patients:[
            // {name:"John Xerxes 3"},
            // {name:"Edwin Squarepants 3"}
        ]
    }
]

export default function Admin(){
    const [isDescriptionVisible, setIsDescriptionVisible] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<isVisibleProps>({dashboard:true,registerDoctor:false,doctorList:false});
    const [isPatientListVisible, setIsPatientListVisible] = useState<boolean>(false);
    const [patients, setPatients] = useState<patient[]>([]);
    const [isDoctorDeletionShown, setIsDoctorDeletionShown] = useState<boolean>(false);
    const [havePatients, setHavePatients] = useState<boolean>(true);
    const [patientDesc, setPatientDesc] = useState<patient>();

    const showPatients = (visible:boolean, patients:any[]) =>{
        setIsPatientListVisible(visible);
        setPatients(patients);
    }

    const displayDoctorDeletion = (patients:any[], visibility:boolean) => {
        setIsDoctorDeletionShown(visibility);
        patients.length == 0 ? setHavePatients(false) : setHavePatients(true);
    }

    return(
        <Content className="flex flex-col justify-start items-center bg-white w-sceen h-screen">
            {/* NAVIGATION BAR */}
            <div className="flex justify-center items-center bg-blue-300 w-screen h-[70px]">
                <div className="flex justify-between items-center w-[28%] ">
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => setIsVisible({dashboard:true, registerDoctor:false, doctorList:false})}>
                        Dashboard
                    </button>
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => setIsVisible({dashboard:false, registerDoctor:true, doctorList:false})}>
                        Register Doctor
                    </button>
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={()=> setIsVisible({dashboard:false, registerDoctor:false, doctorList:true})}>
                        Registered Doctor List
                    </button>
                </div>
            </div>

            {/* DASHBOARD */}
            <div className={`${isVisible['dashboard'] ? 'flex': 'hidden'} justify-evenly items-center bg-gray-200 w-full h-full`}>
                {/* number of patients chart */}
                <span className="flex flex-col justify-evenly items-center h-[300px] w-[300px]">
                    {/* APPEND HERE THE COUNT OF PATIENTS FROM DATABASE*/}
                    <h1 className="flex flex-row justify-center items-center bg-gray-100 h-[200px] w-[200px] rounded-xl text-4xl hover:bg-white hover:cursor-pointer duration-200">
                        560
                    </h1>
                    <h1 className="text-xl">No. of Patients</h1>
                </span>
                {/* number of doctors chart */}
                <span className="flex flex-col justify-evenly items-center h-[300px] w-[300px]">
                    {/* APPEND HERE THE COUNT OF DOCTORS FROM DATABASE*/}
                    <div className="flex flex-row justify-center items-center bg-gray-100 h-[200px] w-[200px] rounded-xl text-4xl hover:bg-white hover:cursor-pointer duration-200">
                        39
                    </div>
                    <h1 className="text-xl">No. of Doctors</h1>
                </span>
            </div>

            {/* REGISTER DOTOR */}
            <div className={ `${isVisible['registerDoctor'] ? 'flex': 'hidden'} justify-center items-center bg-gray-200 w-full h-full`}>
                <button className="bg-blue-50 rounded-[100px] w-[100px] h-[100px] border border-blue-50 hover:bg-white hover:border-blue-300 hover:cursor-pointer duration-200" onClick={() => setIsDescriptionVisible(true)}>
                    Add
                </button>
                <div className={`${isDescriptionVisible ? 'flex' : 'hidden'} justify-center items-center w-full h-full inset-0 bg-black/50 absolute`}>
                    <form className="flex flex-col bg-gray-50 w-[700px] h-[650px] rounded-2xl p-6 overflow-y-scroll">
                        <span className="h-[90px] w-fit mb-4">
                            <h1 className="text-2xl mb-2 font-bold">Register New Doctor</h1>
                            <h1 className="text-gray-500">Fill in the doctor's information below. All fields are required.</h1>
                        </span>
                        <div className="flex flex-col w-full">
                            <h1 className="text-xl mb-4">Personal Information</h1>
                            <span className="flex flex-col h-fit w-full mb-4">
                                <label className="mb-2 text-[0.9em] text-gray-600">Full Name</label>
                                <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="John Karl Crespo"/>
                            </span>
                            <div className="flex flex-row flex-nowrap gap-4 mb-4">
                                <span className="flex flex-col h-fit w-full">
                                    <label className="mb-2 text-[0.9em] text-gray-600">Date of Birth</label>
                                    <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" type="date"/>
                                </span>
                                <span className="flex flex-col h-fit w-full">
                                    <label className="mb-2 text-[0.9em] text-gray-600">Gender</label>
                                    <select className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400">
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
                                    <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="09123456789" required/>
                                </span>
                                <span className="flex flex-col h-fit w-full">
                                    <label className="mb-2 text-[0.9em] text-gray-600">Email Adress</label>
                                    <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="johnkarlcrespo@gmail.com" required/>
                                </span>
                            </div>
                            <span className="flex flex-col h-fit w-full mb-4">
                                <label className="mb-2 text-[0.9em] text-gray-600">Address</label>
                                <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="Medical Street 123 Sta. Rosa Manila" required/>
                            </span>
                            <span className="flex flex-col h-fit w-full mb-4">
                                <label className="mb-2 text-[0.9em] text-gray-600">Profile Photo</label>
                                <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" type="file" required/>
                            </span>
                            <div className="w-full border-t border-gray-300 pt-5">
                                <h1 className="text-xl mb-4">Account Information</h1>

                                <div className="flex flex-row flex-nowrap gap-4 mb-4">
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Username</label>
                                        <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="karljohn123" required/>
                                    </span>
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Password</label>
                                        <input className="border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="password123" type="password" required/>
                                    </span>
                                </div>
                                <div className="flex flex-row flex-nowrap gap-4 mb-4">
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Registration Date</label>
                                        <input className="bg-gray-100 border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" type="date" value="" disabled required/>
                                    </span>
                                    <span className="flex flex-col h-fit w-full">
                                        <label className="mb-2 text-[0.9em] text-gray-600">Role</label>
                                        <input className="bg-gray-100 border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="Role" value="Doctor" disabled required/>
                                    </span>
                                </div>
                                <div className="flex flex-row justify-end items-center w-full h-fit gap-4">
                                    <input className="border border-gray-300 rounded-xl p-3 text-gray-700 text-[0.9em] w-[80px] hover:bg-blue-400 hover:text-white hover:cursor-pointer duration-200" value="Cancel" 
                                    onClick={() => setIsDescriptionVisible(false)} type="button"/>
                                    <button className="border border-gray-300 rounded-xl p-3 text-white text-[0.9em] w-[130px] bg-blue-400 hover:bg-blue-300 hover:cursor-pointer duration-200"  type="submit">
                                        Register Doctor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* REGISTERED DOCTOR LIST */}
            <div className={`${isVisible['doctorList'] ? 'flex': 'hidden'} items-center flex-col bg-gray-200 w-full h-full`}>
                {doctorList.map(doctor => 
                    <div className="flex flex-row justify-between items-center p-2 pl-4 pr-4 bg-blue-300 w-[50%] h-[60px] mt-2 rounded-4xl hover:bg-blue-200 hover:cursor-pointer duration-200" >
                        <h1 className="bg-gray-50 rounded-4xl p-1 pl-5 pr-5">{doctor['name']}</h1>
                        <div className="w-fit">
                            <button className={`${doctor['patients'].length == 0 ? 'hidden' : ''} text-[0.8em] bg-gray-100 rounded-4xl p-2 pl-4 pr-4 hover:cursor-pointer hover:bg-gray-50 duration-200 mr-2`} 
                            onClick={() => showPatients(true,doctor['patients'])}>
                                View Patients
                            </button>
                            <button className="text-[0.8em] bg-red-400 text-white rounded-4xl p-2 pl-4 pr-4 hover:cursor-pointer hover:bg-red-300 duration-200" onClick={() => displayDoctorDeletion(doctor['patients'], true)}>
                                Unregister
                            </button>
                        </div>
                    </div> 
                )}
                <div className={`${isPatientListVisible ? 'flex' : 'hidden'} justify-center items-center absolute inset-0 bg-black/50`} 
                onClick={() => showPatients(false, [])}>
                    <div className="bg-gray-100 w-[500px] h-[600px] rounded-xl p-2">
                        {patients.map(patient => 
                        <div className="flex justify-between items-center bg-blue-200 mb-2 rounded-2xl w-full h-[40px] p-2 pl-4 pr-4 hover:bg-blue-100 hover:cursor-pointer duration-200">
                            <h1 className="bg-gray-50 rounded-4xl pl-3 pr-4">{patient['name']}</h1>
                            <button className="text-[0.8em] bg-gray-100 rounded-4xl p-1 pl-4 pr-4 hover:cursor-pointer hover:bg-gray-50 duration-200" 
                            onClick={() => setPatientDesc(patient)}>
                                View
                            </button>
                        </div>
                        )}
                    </div>
                </div>


                {/* 
                name:string;
                birth:string;
                gender:string;
                contactNumber:string;
                email:string;
                address:string;
                profilePhoto:string;
                registrationDate:sting;
                */}

                {patientDesc ? 
                <div className={`${patientDesc['name'] ? 'flex': 'hidden'} justify-center items-center bg-black/50 absolute inset-0`} 
                onClick={() => setPatientDesc({name:"",address:"",birth:"",contactNumber:"",email:"",gender:"",profilePhoto:"",registrationDate:""})}>
                    <div className="flex flex-col justify-start bg-gray-100 rounded-2xl w-[400px] h-[500px] p-4">
                        <h1 className="text-2xl font-bold">Patient Information</h1>
                        <div className="flex flex-row items-center w-full h-[140px] p-2 border-b border-gray-300">
                            <img src='/zild.jpg'className="h-[100px] w-[100px] rounded-[150px] object-cover border border-blue-100"/>
                            <span className="ml-2 h-fit w-fit">
                                <h1 className="text-xl font-bold">{patientDesc['name']}</h1>
                                <h1 className="text-gray-700">{patientDesc['gender']}</h1>
                            </span>
                        </div>
                        <div className="flex flex-col w-full h-full pt-4 gap-4">
                            <div className="flex flex-row">
                                <img src="/file.svg" className="w-[25px]"/>
                                <span className="ml-3">
                                    <h1 className="text-gray-500 text-[0.8em]">Date of Birth</h1>
                                    <h1>{patientDesc['birth']}</h1>
                                </span>
                            </div>
                            <div className="flex flex-row">
                                <img src="/file.svg" className="w-[25px]"/>
                                <span className="ml-3">
                                    <h1 className="text-gray-500 text-[0.8em]">Email Address</h1>
                                    <h1>{patientDesc['email']}</h1>
                                </span>
                            </div>
                            <div className="flex flex-row">
                                <img src="/file.svg" className="w-[25px]"/>
                                <span className="ml-3">
                                    <h1 className="text-gray-500 text-[0.8em]">Contact Number</h1>
                                    <h1>{patientDesc['contactNumber']}</h1>
                                </span>
                            </div>
                            <div className="flex flex-row">
                                <img src="/file.svg" className="w-[25px]"/>
                                <span className="ml-3">
                                    <h1 className="text-gray-500 text-[0.8em]">Address</h1>
                                    <h1>{patientDesc['address']}</h1>
                                </span>
                            </div>
                            <div className="flex flex-row">
                                <img src="/file.svg" className="w-[25px]"/>
                                <span className="ml-3">
                                    <h1 className="text-gray-500 text-[0.8em]">Regitration Date</h1>
                                    <h1>{patientDesc['registrationDate']}</h1>
                                </span>
                            </div>
                        </div>
                    </div>
                </div> : null
                }

                <div className={`${isDoctorDeletionShown ? 'flex' : 'hidden'} justify-center items-center bg-black/50 absolute inset-0`}>
                    {!havePatients ? 
                    <div className="flex flex-col justify-center items-center bg-gray-100 w-[400px] h-[200px] rounded-2xl p-3">
                        <p className="mb-5">Are you sure you want to unregister this doctor?</p>
                        <div className="flex flex-row justify-evenly items-center w-full h-fit">
                            <button className="bg-green-500 p-2 w-[100px] rounded-4xl text-white hover:bg-green-400 hover:cursor-pointer duration-200">Yes</button>
                            <button className="bg-red-500 p-2 w-[100px] rounded-4xl text-white hover:bg-red-400 hover:cursor-pointer duration-200" onClick={() => setIsDoctorDeletionShown(false)}>No</button>
                        </div>
                    </div> :
                    <div className="flex flex-col justify-center items-center bg-gray-100 w-[400px] h-[200px] rounded-2xl p-3">
                        <p className="mb-5">Doctor have patients, cannot be unregistered.</p>
                        <button className="bg-green-500 p-2 w-[100px] rounded-4xl text-white hover:bg-green-400 hover:cursor-pointer duration-200" onClickCapture={() => setIsDoctorDeletionShown(false)}>Okay</button>
                    </div>
                    }
                </div>
            </div>
        </Content>
    );
}