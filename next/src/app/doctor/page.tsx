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
                        <div className="flex justify-between items-center p-3 w-full h-[50px] bg-blue-200 rounded-4xl mb-2 hover:bg-blue-100 cursor-pointer duration-200">
                            <h1>{patient['name']}</h1>
                            <span className="flex items-center gap-2">
                                <button className="text-[0.7em] bg-gray-200 rounded-4xl w-[50px] h-[30px] hover:bg-gray-100 cursor-pointer duration-200" 
                                onClick={() => setShowNotes(true)}>
                                    Notes
                                </button>
                                <button className="text-[0.9em] bg-gray-100 rounded-4xl p-2 w-[110px] hover:bg-gray-50 cursor-pointer duration-200" 
                                onClick={() => setShowExercises(true)}>
                                    Assign Task
                                </button>
                                <button className="text-[0.9em] bg-red-200 rounded-4xl p-2 w-[110px] hover:bg-red-100 cursor-pointer duration-200">
                                    Remove
                                </button>
                            </span>
                        </div>
                        )}
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
                                <div className="flex items-center w-full h-[50px] bg-gray-300 rounded-4xl p-4 hover:bg-gray-200 cursor-pointer duration-200 mb-2">
                                    <h1 className="">Exercise Name</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REGISTER PATIENT */}
            <div className={`${isVisible['registerPatient'] ? 'flex' : 'hidden'} w-full h-full bg-white`}>
                <h1>register patient</h1>
            </div>
        </Content>
    );
}