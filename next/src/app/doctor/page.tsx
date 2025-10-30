'use client'

import Content from "@/features/layout/Content";
import { useState } from "react";

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

export default function Doctor(){
    const [isVisible, setIsVisible] = useState<isVisibleProps>({dashboard:true, registerPatient:false});
    const [showExercises, setShowExercises] = useState<boolean>(false);
    const [showNotes, setShowNotes] = useState<boolean>(false);
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
    const [showTasks, setShowTasks] = useState<boolean>(false);
    const [showEvaluation, setShowEvaluation] = useState<boolean>(false);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState<boolean>(false);

    return (
        <Content className="flex flex-col justify-start items-center bg-white w-sceen h-screen">
            {/* NAVIGATION BAR */}
            <div className="flex justify-center items-center bg-blue-300 w-screen h-[70px]">
                <div className="flex justify-between items-center w-[17%] ">
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => setIsVisible({dashboard:true, registerPatient:false})}>
                        Dashboard
                    </button>
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => setIsVisible({dashboard:false, registerPatient:true})}>
                        Register Patient
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
                        <div className="flex justify-between items-center p-3 w-full h-[50px] bg-blue-200 rounded-4xl mb-2 hover:bg-blue-100 cursor-pointer duration-200"
                        onClick={() => setShowTasks(true)}>
                            <h1>{patient['name']}</h1>
                            <span className="flex items-center gap-2">
                                <button className="text-[0.7em] bg-gray-200 rounded-4xl w-[50px] h-[30px] hover:bg-gray-100 cursor-pointer duration-200" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNotes(true);
                                    }}>
                                    Notes
                                </button>
                                <button className="text-[0.9em] bg-gray-100 rounded-4xl p-2 w-[110px] hover:bg-gray-50 cursor-pointer duration-200" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowExercises(true);
                                    }}>
                                    Assign Task
                                </button>
                                <button className="text-[0.9em] bg-red-200 rounded-4xl p-2 w-[110px] hover:bg-red-100 cursor-pointer duration-200" 
                                onClick={(e) => {
                                    e.stopPropagation();
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
                                <div className="flex justify-between items-center w-full h-[50px] bg-gray-300 rounded-4xl p-4 hover:bg-gray-200 cursor-pointer duration-200 mb-2">
                                    <h1 className="">Tasks Name</h1>
                                    <span className="flex flex-row items-center gap-2 text-[0.8em]">
                                        <button className="bg-green-400 text-white p-1 pl-3 pr-3 rounded-2xl cursor-pointer hover:bg-green-300 duration-200" 
                                        onClick={() => {
                                            setShowTasks(false);
                                            setShowEvaluation(true);
                                            }}>
                                            Evaluation
                                        </button>
                                        <button className="bg-red-400 text-white p-1 pl-3 pr-3 rounded-2xl cursor-pointer hover:bg-red-300 duration-200" 
                                        onClick={() => console.log("Task removed")}>
                                            Remove
                                        </button>
                                    </span>
                                </div>
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
                                <img className="bg-black rounded-2xl w-[250px] h-full"/>
                                <img className="bg-black rounded-2xl w-[250px] h-full"/>
                                <img className="bg-black rounded-2xl w-[250px] h-full"/>
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
                            onFocus={() => setShowUpdateButton(true)}/>
                            <span className={`${showUpdateButton ? 'flex' : 'hidden'} gap-3 mt-3 w-full justify-end items-center`}>
                                <button className="bg-gray-200 rounded-4xl w-[100px] p-2 cursor-pointer hover:bg-gray-100 duration-200" 
                                onClick={() => setShowUpdateButton(false)}>
                                    Cancel
                                </button>
                                <button className="bg-blue-200 rounded-4xl w-[100px] p-2 cursor-pointer hover:bg-blue-100 duration-200" 
                                onClick={() => {
                                    // add a function that update to db here
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
                                <div className="flex items-center w-full h-[50px] bg-gray-300 rounded-4xl p-4 hover:bg-gray-200 cursor-pointer duration-200 mb-2">
                                    <h1 className="">Exercise Name</h1>
                                </div>
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
                    <form className="flex flex-col bg-gray-50 w-[700px] h-[650px] rounded-2xl p-6 overflow-y-scroll">
                        <span className="h-[90px] w-fit mb-4">
                            <h1 className="text-2xl mb-2 font-bold">Register New Patient</h1>
                            <h1 className="text-gray-500">Fill in the patient's information below. All fields are required.</h1>
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
                                        <input className="bg-gray-100 border border-gray-200 rounded-xl w-full h-[50px] p-2 focus:outline-none focus:border-blue-400" placeholder="Role" value="Patient" disabled required/>
                                    </span>
                                </div>
                                <div className="flex flex-row justify-end items-center w-full h-fit gap-4">
                                    <input className="border border-gray-300 rounded-xl p-3 text-gray-700 text-[0.9em] w-[80px] hover:bg-blue-400 hover:text-white hover:cursor-pointer duration-200" value="Cancel" 
                                    onClick={() => setIsDescriptionVisible(false)} type="button"/>
                                    <button className="border border-gray-300 rounded-xl p-3 text-white text-[0.9em] w-[130px] bg-blue-400 hover:bg-blue-300 hover:cursor-pointer duration-200"  type="submit">
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