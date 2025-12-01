'use client'

import CameraFeed from "@/features/CameraFeed";
import Content from "@/features/layout/Content";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AssignedExerciseProps = {
    id:string;
    assignId:string;
    exercise: string;
    description: string;
    image: string;
    filepath: string;
    score: number;
}

type ActivatedExerciseProps = {
    id: string;
    nameConventions: {
        exercise: string;
        snakeName: string;
    }
    dataPoints:number[];
    label:string;
    parts:string[]
}

type ActivatedExerciseProps2 = {
    id: string;
    assignId:string;
    nameConventions: {
        exercise: string;
        snakeName: string;
    }
    dataPoints:number[];
    label:string;
    parts:string[]
}

export default function Patient() {
    const params = useParams<{ id: string }>(); 
    const { id } = params;
    const router = useRouter();

    const [recordMode, setRecordMode] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [description, setDescription] = useState("");
    const [score, setScore] = useState(0);
    const [assignedExercises, setAssignedExercises] = useState<AssignedExerciseProps[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<ActivatedExerciseProps2>();

    const exercises: ActivatedExerciseProps[] = [
        { id:"1", nameConventions:{ exercise:"side arms raise", snakeName:"side_arms_raise" }, dataPoints:[11,12,13,14,23,24], label:"SIDE ARMS RAISE HOLD", parts:["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_HIP","RIGHT_HIP"]},
        { id:"2", nameConventions:{ exercise:"calf raise", snakeName:"calf_raise" }, dataPoints:[25,26,27,28,29,30], label:"CALF RAISE HOLD", parts:["LEFT_KNEE", "RIGHT_KNEE", "LEFT_ANKLE", "RIGHT_ANKLE", "LEFT_HEEL", "RIGHT_HEEL"]},
        { id:"3", nameConventions:{ exercise:"chest squeeze", snakeName:"chest_squeeze" }, dataPoints:[11,12,13,14,15,16,23,24], label:"CHEST SQUEEZE HOLD", parts:["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_WRIST","RIGHT_WRIST","LEFT_HIP","RIGHT_HIP"]},
        { id:"4", nameConventions:{ exercise:"front arms raise", snakeName:"front_arms_raise" }, dataPoints:[11,12,13,14,23,24], label:"FRONT ARMS RAISE HOLD", parts:["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_HIP","RIGHT_HIP"] },
        { id:"5", nameConventions:{ exercise:"squat", snakeName:"squat" }, dataPoints:[11,12,23,24,25,26,], label:"SQUAT HOLD", parts:["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_HIP","RIGHT_HIP","LEFT_KNEE","RIGHT_KNEE"] },
        { id:"6", nameConventions:{ exercise:"wall sit", snakeName:"wall_sit" }, dataPoints:[11,12,13,14,23,24,25,26,27,28], label:"WALL SIT ARM HOLD", parts:["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_HIP","RIGHT_HIP","LEFT_KNEE","RIGHT_KNEE","LEFT_ANKLE","RIGHT_ANKLE"] }
    ];

    useEffect(() => {
        listAssignedExercises();
    }, []);

    const logout = () => router.replace("/");

    const listAssignedExercises = async () => {
        const res = await fetch("/api/patient/load_assigned_exercise", {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({patientId:id})
        });
        const data = await res.json();
        if(data.success) setAssignedExercises(data.exercises);
    }

    const openDescription = (exercise: AssignedExerciseProps, exerciseId: string, assignId:string) => {
        setDescription(exercise.description);
        setScore(exercise.score ?? 0);
        setShowDescription(true);

        console.log(exerciseId);
        let fullEx = exercises.find(e => e.id === exerciseId.toString());
        
        if (!fullEx) return;

        const exWithAssignId: ActivatedExerciseProps2 = {
            ...fullEx,
            assignId: assignId
        };
        setSelectedExercise(exWithAssignId);
    }

    const openRecord = () => {
        if (!selectedExercise) return;
        setShowDescription(false);
        setRecordMode(true);
    }

    const evaluateRecord = async () => {
        const res = await fetch("/api/patient/evaluate_record",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({exercise:selectedExercise?.nameConventions.snakeName, assignId: selectedExercise?.assignId})
        });

        const data = await res.json();

        if(data.success){
            setRecordMode(false);
        }
    }

    const closeDescription = () => setShowDescription(false);
    const closeRecord = () => setRecordMode(false);

    return (
        <Content className="flex flex-col justify-center items-center w-screen h-screen bg-white p-5">

            <div className="flex justify-center items-center w-[22%] mb-5">
                <button className="bg-gray-200 border border-gray-400 rounded-xl p-3 hover:bg-gray-100 duration-200" onClick={logout}>
                    Logout
                </button>
            </div>

            {/* Exercise Cards*/}
            <div className="flex flex-wrap justify-start items-start w-full h-full gap-5">
                {assignedExercises.map((exercise, i) => (
                    <div key={i} className="flex flex-col justify-center items-center bg-blue-200 h-[300px] w-[283px] gap-5 rounded-4xl hover:cursor-pointer hover:bg-blue-100 duration-200 p-4"
                        onClick={() => openDescription(exercise, exercise.id, exercise.assignId)}>
                        <img src={exercise.image} className="w-full h-[200px] object-cover" />
                        <h1 className="flex flex-nowrap justify-center w-full">{exercise.exercise}</h1>
                    </div>
                ))}
            </div>

            {/* Description Modal */}
            <div className={`${showDescription ? 'flex' : 'hidden'} justify-center items-center inset-0 fixed bg-black/50`}>
                <div className="flex flex-col justify-center items-center bg-gray-50 w-[1200px] h-[700px] rounded-2xl p-5">
                    <button className="bg-gray-700 text-white rounded-4xl p-2 w-[100px] hover:bg-gray-600 duration-200" 
                    onClick={() => closeDescription()}>
                        Close
                    </button>
                    <p className="text-justify mt-5">{description}</p>
                    <button className="bg-red-600 text-white rounded-4xl p-2 w-[100px] mt-5 hover:bg-red-500 duration-200" 
                    onClick={() => openRecord()}>
                        Record
                    </button>
                    <h1 className="flex justify-center items-center bg-green-600 text-white rounded-xl p-2 w-[100px] text-xl mt-5">{score}</h1>
                </div>
            </div>

            {/* Record Modal*/}
            <div className={`${recordMode ? 'flex' : 'hidden'} justify-center items-center fixed inset-0 bg-black/50`}>
                <div className="flex flex-col justify-center items-center bg-gray-50 w-[1200px] h-[700px] rounded-2xl">
                    {selectedExercise && (
                        <CameraFeed exercise={selectedExercise.nameConventions.snakeName} parts={selectedExercise.parts}
                        dataPoints={selectedExercise.dataPoints} label={selectedExercise.label} />
                    )}
                    <div className="flex flex-row gap-5 p-5">
                        <button className="bg-gray-700 text-white rounded-4xl p-2 w-[100px] hover:bg-gray-600 duration-200" 
                        onClick={() => closeRecord()}>
                            Cancel
                        </button>
                        <button className="bg-blue-600 text-white rounded-4xl p-2 w-[100px] hover:bg-blue-500 duration-200" 
                        onClick={() => evaluateRecord()}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Content>
    );
}
