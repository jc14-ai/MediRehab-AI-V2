import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { patientId } = await req.json();

    const patientExercise = await prisma.assign.findMany({
      where: { patient_id: Number(patientId) },
      select: { exercise_id: true },
    });

    const givenExercises = patientExercise.map((exercise) => exercise.exercise_id);

    if (givenExercises.length === 0) {
      return NextResponse.json({ success: true, exercises: [] });
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        exercise_id: {
          in: givenExercises,
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
        assign: {
          where: { patient_id: Number(patientId) },
          select: {
            assign_id: true,
            result: {
              select: {
                result_id: true,
                score: true,
              },
            },
          },
        },
      },
    });

    const formatted = exercises.map((ex) => {
      const assign = ex.assign[0];
      const result = assign?.result?.[0];
      
      return {
        exercise_id: ex.exercise_id,
        exercise: ex.exercise,
        description: ex.description,
        image: ex.exercise_image[0]?.image_name ?? null,
        filepath: ex.exercise_image[0]?.filepath ?? null,
        score: result?.score ?? null,
      };
    });

    return NextResponse.json({ success: true, exercises: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error." });
  }
}