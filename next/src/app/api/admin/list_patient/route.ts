import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const data = await req.json();
    const { doctorId } = data;

    if (doctorId){
        const patients = await prisma.doctors_patient.findMany({
        where:{
            doctor_id: doctorId
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

        return NextResponse.json({success:true, patients:patients});
    }  

    return NextResponse.json({success:false});
}