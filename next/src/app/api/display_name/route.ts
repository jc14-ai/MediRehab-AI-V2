import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        const user = await prisma.account.findFirst({
            where: {
                account_id: Number(id)
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({
            success: true,
            name: user.username
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" });
    }
}
