import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { id } = await req.json();

        const doctors_patient = await prisma.doctors_patient.findFirst({
            where:{
                doctors_patient_id:Number(id)
            },
            select:{
                notes:true
            }
        });

        if(!doctors_patient) return NextResponse.json({success:false, mesage: 'data does not exist.'});

        return NextResponse.json({success:true, note:doctors_patient.notes});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}