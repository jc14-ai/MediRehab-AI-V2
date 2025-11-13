import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const data = await req.json();

        const { id } = data;

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

        return NextResponse.json({success:true, patients:patients});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }

}