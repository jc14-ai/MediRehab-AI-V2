'use client'

import Content from "@/features/layout/Content";
import { useState } from "react";

type isVisibleProps = {
    dashboard:boolean;
    registerDoctor:boolean;
    doctorList:boolean;
}

export default function Admin(){
    const [isDescriptionVisible, setIsDescriptionVisible] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<isVisibleProps>({dashboard:true,registerDoctor:false,doctorList:false});
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
            <div className={ `${isVisible['registerDoctor'] ? 'flex': 'hidden'} justify-center items-center bg-gray-200 w-full h-full`}>
                <button className="bg-blue-50 rounded-[100px] w-[100px] h-[100px] border border-blue-50 hover:bg-white hover:border-blue-300 hover:cursor-pointer duration-200" onClick={() => setIsDescriptionVisible(true)}>
                    Add
                </button>
                <div className={`${isDescriptionVisible ? 'flex' : 'hidden'} justify-center items-center w-full h-full inset-0 bg-black/50 absolute`} onClick={() => setIsDescriptionVisible(false)}>
                    <div className="flex justify-center items-start bg-gray-200 w-[500px] h-[650px] rounded-2xl p-3">
                        <h1 className="text-[1.2em]">Doctor Description</h1>
                    </div>
                </div>
            </div>
            <div className={`${isVisible['doctorList'] ? 'flex': 'hidden'} bg-gray-200 w-full h-full`}>
                <h1>registered doctor list</h1>

            </div>
        </Content>
    );
}