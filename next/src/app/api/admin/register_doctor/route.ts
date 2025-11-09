import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const data = await req.json();
    const { fullname, birthDate, gender, contact, email, address, profilePic, username, password, registrationDate, role } = data;

    const accountRole = await prisma.roles.findFirst({
        where: {
            role:role
        },
        select:{
            role_id: true
        }
    })

    if (accountRole) {
        await prisma.account.create({
        data:{
            username:username,
            password:password,
            registration_date: new Date(),
            role_id: accountRole.role_id
        }});

        const account = await prisma.account.findFirst({
            where:{
                username:username,
                password:password,
                registration_date: new Date()
            },
            select:{
                account_id:true
            }
        })

        if(account){
            const newDoctor = await prisma.doctor.create({
            data:{
                account_id:account.account_id,
                full_name:fullname,
                birth_date: new Date(birthDate),
                gender:gender,
                contact:contact,
                email:email,
                address:address
            }});

            await prisma.user_image.create({
                data: {
                    account_id:account.account_id,
                    image_name:profilePic,
                    filepath:profilePic
                }
            })

            if (newDoctor) return NextResponse.json(newDoctor);
        }
    }
    return NextResponse.json({})
}

export async function GET(){
    const doctors = await prisma.doctor.findMany();

    return NextResponse.json(doctors);
}

