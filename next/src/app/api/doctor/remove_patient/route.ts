import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const data = await req.json();
        const { patientId, doctorId } = data;
        const doctorPatient = await prisma.doctors_patient.findFirst({
            where:{
                patient_id: Number(patientId),
                doctor_id: Number(doctorId)
            },
            select:{
                doctors_patient_id:true,
                patient:{
                    select:{
                        patient_id:true,
                        account_id:true
                    }
                }
            }
        });

        if (!doctorPatient) return NextResponse.json({success:false, message:'Patient not found.'});

        const doctorPatientDeleted = await prisma.doctors_patient.delete({
            where:{
                doctors_patient_id: doctorPatient.doctors_patient_id
            }
        });

        if (!doctorPatientDeleted) return NextResponse.json({success:false, message:'Patient not found.'});

        const patientDeleted = await prisma.patient.delete({
            where:{
                patient_id: doctorPatient.patient.patient_id
            }
        });

        if(!patientDeleted) return NextResponse.json({success:false, message:'Patient not found.'});

        const picture = await prisma.user_image.findFirst({
            where:{
                account_id:doctorPatient.patient.account_id
            },
            select:{
                user_image_id:true
            }
        })

        if (!picture) return NextResponse.json({success:false, message:'Picture not found.'});

        const pictureDeleted = await prisma.user_image.delete({
            where:{
                user_image_id:picture.user_image_id
            }
        })

        if (!pictureDeleted) return NextResponse.json({success:false, message:'Picture not found.'});

        const accountDeleted = await prisma.account.delete({
            where:{
                account_id:doctorPatient.patient.account_id
            }
        });

        if (!accountDeleted) return NextResponse.json({success:false, message:'Account not found.'});

        const patients = await prisma.doctors_patient.findMany({
            where:{
                doctor_id: Number(doctorId)
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