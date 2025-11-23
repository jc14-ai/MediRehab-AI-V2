import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { resultId, feedback } = await req.json();

        const existing = await prisma.feedback.findFirst({
            where:{
                result_id:Number(resultId)
            },
            select:{
                feedback_id:true
            }
        });

        if(!existing){
            const feedbackCreated = await prisma.feedback.create({
                data:{
                    result_id:Number(resultId),
                    feedback:feedback
                }
            });

            if(!feedbackCreated) return NextResponse.json({success:false, message:'Feedback cannot be created.'});
        }else{
            const feedbackUpdated = await prisma.feedback.update({
                where:{
                    feedback_id:existing.feedback_id
                },
                data:{
                    feedback:feedback
                }
            });

            if(!feedbackUpdated) return NextResponse.json({success:false, message:'Feedback cannot be updated.'});
        }

        return NextResponse.json({success:true})
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}