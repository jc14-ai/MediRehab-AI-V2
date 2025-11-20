import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { fullName, birthDate, gender, contact, email, address, profilePic, username, password, role , doctorId} = await req.json();

        const accountRole = await prisma.roles.findFirst({
            where: {
                role:role
            },
            select:{
                role_id: true
            }
        });

        if(!accountRole) return NextResponse.json({success:false, message:'Role not found.'});

        
        const account = await prisma.account.create({
            data:{
                username:username,
                password:password,
                registration_date: new Date(),
                role_id: accountRole.role_id
            },
            select:{
                account_id:true
            }
        });

        if (!account) return NextResponse.json({success:false, message:'Failed to create account.'});

        const newPatient = await prisma.patient.create({
            data:{
                account_id:account.account_id,
                full_name:fullName,
                birth_date: new Date(birthDate),
                gender:gender,
                contact:contact,
                email:email,
                address:address
            },
            select:{
                patient_id:true
            }
        });

        if (!newPatient) return NextResponse.json({success:false, message:'Failed to register patient.'});

        const patientImage = await prisma.user_image.create({
            data: {
                account_id:account.account_id,
                image_name:profilePic,
                filepath:profilePic
            }
        });

        if(!patientImage) return NextResponse.json({success:false, message:'Failed to upload profile picture.'});

        const doctorPatient = await prisma.doctors_patient.create({
            data:{
                doctor_id: Number(doctorId),
                patient_id: newPatient.patient_id
            }
        });

        if(!doctorPatient) return NextResponse.json({success:false, message:'Failed to link doctor and patient.'});

        return NextResponse.json({success:true, message:'Patient registered successfully.'});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}

export async function GET(){
    const patients = await prisma.patient.findMany();

    return NextResponse.json(patients);
}

