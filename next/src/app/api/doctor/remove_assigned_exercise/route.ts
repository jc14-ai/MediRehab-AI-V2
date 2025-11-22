import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { patientId, exerciseId } = await req.json();

        const assignedExercise = await prisma.assign.findFirst({
            where:{
                patient_id:Number(patientId),
                exercise_id:Number(exerciseId)
            },
            select:{
                assign_id:true
            }
        });

        if(!assignedExercise) return NextResponse.json({success:false, message:'Assigned exercise not found.'});

        const assignedExerciseDeleted = await prisma.assign.delete({
            where:{
                assign_id:assignedExercise.assign_id
            }
        });

        if(!assignedExerciseDeleted) return NextResponse.json({success:false, message:'Assigned exercise not deleted.'});
        
        return NextResponse.json({success:true, message:'Assigned exercise deleted.'});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}