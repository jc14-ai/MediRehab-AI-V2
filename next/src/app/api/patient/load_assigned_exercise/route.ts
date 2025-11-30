import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const { patientId } = await req.json();

        const patientExercise = await prisma.assign.findMany({
            where:{
                patient_id:Number(patientId)
            },
            select:{
                exercise_id:true,
            }
        });

        const givenExercises = patientExercise.map(exercise => exercise.exercise_id);

        const exercises = await prisma.exercise.findMany({
            where:{
                exercise_id:{ 
                    in: givenExercises
                }
            },
            select:{
                exercise: true,
                description: true,
                exercise_image: {
                    select: {
                        image_name: true,
                        filepath: true
                    }
                },
                assign: {
                    select: {
                        exercise_id:true,
                        assign_id: true,
                        result: {
                            select: {
                                score: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({success: true, exercises: exercises.map(exercise => ({
            id:exercise.assign?.[0].exercise_id,
            exercise: exercise.exercise,
            description: exercise.description,
            image: exercise.exercise_image[0]?.image_name ?? null,
            filepath: exercise.exercise_image[0]?.filepath ?? null,
            score: exercise.assign?.[0]?.result?.[0]?.score ?? null
        }))});

    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}