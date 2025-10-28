'use client'

import CameraFeed from "@/features/CameraFeed";
import Content from "@/features/layout/Content";
import { useState } from "react";

// type exercise = {
//     name: string;
//     image: string;
//     description: string;
//     scoreSummary: number;
// }

const exercises = [
    {
        name: "Arms raise",
        image: "/file.svg",
        description: "description heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription here",
        scoreSummary: 92
    },
    {
        name: "Squat",
        image: "/file.svg",
        description: "description heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription here",
        scoreSummary: 93
    },
    {
        name: "Pushups",
        image: "/file.svg",
        description: "description heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription here",
        scoreSummary: 90
    },
    {
        name: "Standups",
        image: "/file.svg",
        description: "description heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription here",
        scoreSummary: 82
    },
    {
        name: "Situps",
        image: "/file.svg",
        description: "description heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription heredescription here",
        scoreSummary: 82
    }
]

export default function Patient() {
    const [recordMode, setRecordMode] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [showDescription, setShowDescription] = useState<boolean>(false);

    const displayExercise = (visibility: boolean, description: string, score: number) => {
        setDescription(description);
        setScore(score);
        setShowDescription(visibility);
    }

    const displayRecord = (visibilityRecord:boolean, visibilityDesc:boolean) => {
        setShowDescription(visibilityDesc);
        setRecordMode(visibilityRecord);
    }

    return (
        <Content className="flex justify-center items-center w-screen h-screen bg-white p-5">
            <div className="flex flex-wrap justify-start items-start w-full h-full gap-5">
                {exercises.map(exercise =>
                    <div className="flex flex-col justify-center items-center bg-blue-200 h-[300px] w-[283px] gap-5 rounded-4xl hover:cursor-pointer hover:bg-blue-100 duration-200 p-4"
                        onClick={() => displayExercise(true, exercise['description'], exercise['scoreSummary'])}>
                        <img src={exercise['image']} className="w-full h-[200px] object-cover" />
                        <h1 className="flex flex-nowrap justify-center w-full">{exercise['name']}</h1>
                    </div>
                )}

                <div className={`${showDescription ? 'flex' : 'hidden'} justify-center items-center inset-0 fixed bg-black/50`}>
                    <div className="flex flex-col justify-center items-center bg-gray-50 w-[1200px] h-[700px] rounded-2xl p-5">
                        <button className="bg-gray-700 text-white rounded-4xl p-2 w-[100px] hover:bg-gray-600 hover:cursor-pointer duration-200"
                            onClick={() => displayExercise(false, "", 0)}>
                            close
                        </button>
                        <p className="text-justify">{description}</p>
                        <button className="bg-red-600 text-white rounded-4xl p-2 w-[100px] hover:bg-red-500 hover:cursor-pointer duration-200" 
                        onClick={() => displayRecord(true,false)}>
                            Record
                        </button>
                        <h1 className="flex justify-center items-center bg-green-600 text-white rounded-xl p-2 w-[100px] text-xl">{score}</h1>
                    </div>
                </div>

                <div className={`${recordMode ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50`}>
                    <div className="flex flex-col justify-center items-center bg-gray-50 w-[1200px] h-[700px] rounded-2xl">
                        <CameraFeed visibility={true} />
                        <div className="flex flex-row gap-5 p-5">
                            <button className="bg-gray-700 text-white rounded-4xl p-2 w-[100px] hover:bg-gray-600 hover:cursor-pointer duration-200"
                            onClick={() => displayRecord(false,true)}>
                                cancel
                            </button>
                            <button className="bg-blue-600 text-white rounded-4xl p-2 w-[100px] hover:bg-blue-500 hover:cursor-pointer duration-200" 
                            onClick={() => console.log("Saved!")}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
}