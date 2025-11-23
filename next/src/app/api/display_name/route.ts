import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { id } = await req.json();

        const user = await prisma.account.findFirst({
            where:{
                //TODO: THI`S IS WRONG, id CAME FROM admin/doctor/patient, NOT ON ACCOUNT ID, SO FIX THIS
                account_id:Number(id)
            }
        })
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}