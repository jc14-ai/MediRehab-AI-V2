import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const data = await req.json();
    const { id } = data;

    const doctor = await prisma.doctor.findFirst({
        where:{
            account_id:id
        },
        select:{
            doctor_id:true
        }
    });

    if (doctor){
        const patients = await prisma.doctors_patient.findMany({
        where:{
            doctor_id: doctor.doctor_id
        },
        select:{
            patient_id:true,
            patient:{
                select:{
                    account:{
                        select:{
                            registration_date:true
                        }
                    },
                    account_id:true,
                    full_name:true,
                    birth_date:true,
                    gender:true,
                    contact:true,
                    email:true,
                    address:true
                }
            },
            notes:true
        }});

        return NextResponse.json(patients);
    }  

    return NextResponse.json({})
}