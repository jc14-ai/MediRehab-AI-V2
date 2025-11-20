import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { id } = await req.json();

        const patients = await prisma.doctors_patient.findMany({
            where:{
                doctor_id: Number(id)
            },
            select:{
                doctors_patient_id:true,
                patient_id:true,
                patient:{
                    select:{
                        full_name:true
                    }
                },
                notes:true
            }
        });

        if (!patients) return NextResponse.json({success:false, message: 'Cannot list patients.'});
        return NextResponse.json({success:true, patients:patients});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }

}