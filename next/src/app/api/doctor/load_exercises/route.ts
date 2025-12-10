import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { patientId } = await req.json();

    const patient = await prisma.assign.findMany({
      where: {
        patient_id: Number(patientId),
      },
      select: {
        exercise_id: true,
      },
    });

    const exerciseIds = patient.map((exercise) => exercise.exercise_id);

    const exercises = await prisma.exercise.findMany({
      where: {
        exercise_id: {
          notIn: exerciseIds,
        },
      },
      select: {
        exercise_id: true,
        exercise: true,
        description: true,
        exercise_image: {
          select: {
            image_name: true,
            filepath: true,
          },
        },
      },
    });

    const formatted = exercises.map((ex) => ({
      exercise_id: ex.exercise_id,
      exercise: ex.exercise,
      description: ex.description,
      image: ex.exercise_image[0]?.image_name ?? null,
      filepath: ex.exercise_image[0]?.filepath ?? null,
    }));

    return NextResponse.json({ success: true, exercises: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error." });
  }
}