import { access } from "fs";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export  async function POST(req:Request){
    try {
        const {username, password} = await req.json();

        const account = await prisma.account.findFirst({
            where: {username, password},
            select: {
                account_id: true,
                username: true,
                roles: {
                    select: {
                        role: true
                    }
                }
            } 
        });

        if (!account) {
            return NextResponse.json({success:false, message: 'Invalid Credentials'});
        }

        if(account.roles.role === 'admin'){
            const admin = await prisma.admin.findFirst({
                where:{
                    account_id:account.account_id
                },
                select:{
                    admin_id:true
                }
            });

            if(!admin) return NextResponse.json({success:false, message: 'Invalid Credentials'});

            return NextResponse.json({success:true, id:admin.admin_id, role:account.roles.role});
        }

        if(account.roles.role === 'doctor'){
            const doctor = await prisma.doctor.findFirst({
                where:{
                    account_id:account.account_id
                },
                select:{
                    doctor_id:true,
                    full_name:true
                }
            });
            if(!doctor) return NextResponse.json({success:false, message: 'Invalid Credentials'}); 
            
            return NextResponse.json({success:true, id:doctor.doctor_id, full_name:doctor.full_name, role:account.roles.role});
        }

        if(account.roles.role === 'patient'){
            const patient = await prisma.patient.findFirst({
                where:{
                    account_id:account.account_id
                },
                select:{
                    patient_id:true,
                    full_name:true
                }
            });

            if(!patient) return NextResponse.json({success:false, message: 'Invalid Credentials'}); 

            return NextResponse.json({success:true, id:patient.patient_id, full_name:patient.full_name, role:account.roles.role});
        }

        return NextResponse.json({success:false, message:'Invalid Credentials'});   
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'})
    }
};