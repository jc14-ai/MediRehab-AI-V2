import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { patientId } = await req.json();

        const patientExercise = await prisma.assign.findMany({
            where:{
                patient_id:Number(patientId)
            },
            select:{
                exercise_id:true
            }
        });

        const givenExercises = patientExercise.map(exercise => exercise.exercise_id);

        const exercises = await prisma.exercise.findMany({
            where:{
                exercise_id:{
                    in:givenExercises
                }
            }
        });
        
        return NextResponse.json({success:true, exercises:exercises});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}