'use client'

import Content from "@/features/layout/Content";
import { useState } from "react";

type isVisibleProps = {
    dashboard:boolean;
    registerPatient:boolean;
    assigningSection:boolean;
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
    const [isVisible, setIsVisible] = useState<isVisibleProps>({dashboard:true, registerPatient:false, assigningSection:false});

    return (
        <Content className="flex flex-col justify-start items-center bg-white w-sceen h-screen">
            {/* NAVIGATION BAR */}
            <div className="flex justify-center items-center bg-blue-300 w-screen h-[70px]">
                <div className="flex justify-between items-center w-[28%] ">
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => setIsVisible({dashboard:true, registerPatient:false, assigningSection:false})}>
                        Dashboard
                    </button>
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={() => setIsVisible({dashboard:false, registerPatient:true, assigningSection:false})}>
                        Register Patient
                    </button>
                    <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 hover:cursor-pointer duration-200" 
                    onClick={()=> setIsVisible({dashboard:false, registerPatient:false, assigningSection:true})}>
                        Assigning Section
                    </button>
                </div>
            </div>

            {/* DASHBOARD */}
            <div className={`${isVisible['dashboard'] ? 'flex' : 'hidden'} justify-center items-center w-full h-full bg-white`}>
                <div className="flex flex-col items-center w-[800px] h-[90%] bg-blue-50 border border-blue-200 rounded-2xl">
                    <h1 className="flex justify-start items-center w-full h-[50px] bg-white rounded-tl-2xl rounded-tr-2xl pl-5 text-xl font-bold">Patient List</h1>
                    {patients.map(patient => 
                    <div className="">{patient['name']}</div>
                    )}
                </div>
            </div>

            {/* REGISTER PATIENT */}
            <div className={`${isVisible['registerPatient'] ? 'flex' : 'hidden'} w-full h-full bg-white`}>
                <h1>register patient</h1>
            </div>

            {/* ASSIGNING SECTION */}
            <div className={`${isVisible['assigningSection'] ? 'flex' : 'hidden'} w-full h-full bg-white`}>
                <h1>assign section</h1>
            </div>
        </Content>
    );
}