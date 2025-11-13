import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { id, note } = await req.json();

        const doctors_patient = await prisma.doctors_patient.update({
            where:{
                doctors_patient_id:Number(id)
            },
            data:{
                notes:note
            },
            select:{
                notes:true
            }
        })

        return NextResponse.json({success:true, note: doctors_patient.notes})
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'})
    }
}