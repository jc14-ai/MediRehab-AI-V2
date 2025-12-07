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

        const result = await prisma.result.findFirst({
            where:{
                assign_id:assignedExercise.assign_id
            }
        })

        if(!result) return NextResponse.json({success:false, message:'Result not found.'});

        const resultImageDeleted = await prisma.result_image.deleteMany({
            where:{
                result_id:result.result_id
            }
        });

        if(!resultImageDeleted) return NextResponse.json({success:false, message:'Image/s not deleted.'});

        const feedback = await prisma.feedback.findFirst({
            where:{
                result_id:result.result_id
            }
        });

        if (!feedback) return NextResponse.json({success:false, message:'Feedback not found'});

        const feedbackDeleted = await prisma.feedback.delete({
            where:{
                feedback_id:feedback.feedback_id
            }
        })

        if (!feedbackDeleted) return NextResponse.json({success:false, message:'Feedback not deleted'});

        const resultDeleted = await prisma.result.delete({
            where:{
                result_id:result.result_id
            }
        })

        if (!resultDeleted) return NextResponse.json({success:false, message:'Result not deleted.'});

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