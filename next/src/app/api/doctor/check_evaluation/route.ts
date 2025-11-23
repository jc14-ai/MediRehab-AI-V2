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

        const existing = await prisma.result.findFirst({
            where:{ 
                assign_id:assignedExercise.assign_id
            },
            select:{
                result_id:true
            }
        });

        if (!existing) return NextResponse.json({success:true, existing:false});

        const resultImages = await prisma.result_image.findMany({
            where:{
                result_id:existing.result_id
            },
            select:{
                image_name:true,
                filepath:true
            }
        });

        if(!resultImages) return ({success:false, existing:true, message: "No resulting images."});

        return NextResponse.json({success:true, existing: true, resultImages:resultImages.map(resultImages => {
            return {image:resultImages.image_name, filepath:resultImages.filepath}
        }), resultId:existing.result_id});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}