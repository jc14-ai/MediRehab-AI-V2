import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { doctorId } = await req.json();

        const doctorDeleted = await prisma.doctor.delete({
            where:{
                doctor_id: Number(doctorId)
            },
            select:{
                account_id:true
            }
        });

        if(!doctorDeleted) return NextResponse.json({success:false, message:'Doctor not found.'});

        const picture = await prisma.user_image.findFirst({
            where:{
                account_id: doctorDeleted.account_id
            },
            select:{
                user_image_id:true
            }
        });

        if(!picture) return NextResponse.json({success:false, message:'Picture not found.'});
        
        const pictureDeleted = await prisma.user_image.delete({
            where:{
                user_image_id: picture.user_image_id
            }
        });

        if(!pictureDeleted) return NextResponse.json({success:false, message:'Failed to delete picture.'});

        const accountDeleted = await prisma.account.delete({
            where:{
                account_id: Number(doctorDeleted.account_id)
            }
        });

        if (!accountDeleted) return NextResponse.json({success:false, message:'Account not found.'});

        return NextResponse.json({success:true, message:'Doctor removed successfully.'});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}