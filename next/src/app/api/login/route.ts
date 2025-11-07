import { access } from "fs";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export  async function POST(req:Request){
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
        return NextResponse.json({message: 'Invalid Credentials'}, {status:401});
    }

    return NextResponse.json({
        account_id: account.account_id,
        username: account.username,
        role: account.roles.role
    });
};