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
        
        return NextResponse.json({success:true, message:'Exercise assigned to the patient successfully.'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}