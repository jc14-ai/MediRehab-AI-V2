import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const {patientId, exerciseId} = await req.json();

        const assigned = await prisma.assign.create({
            data:{
                patient_id:Number(patientId),
                exercise_id:Number(exerciseId)
            }
        });

        if(!assigned) return NextResponse.json({success:false, message:'Exercise not assigned to patient.'});

        const result = await prisma.result.create({
            data:{
                assign_id:assigned.assign_id,
                score: 0
            }
        });

        if(!result) return NextResponse.json({success:false, message:'Result not initialized.'});
        
        return NextResponse.json({success:true, message:'Exercise assigned to the patient successfully.'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}