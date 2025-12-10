import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const countExercises = await prisma.exercise.count();

        return NextResponse.json({success:true, numberOfExercises: countExercises});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}