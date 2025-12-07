import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
 
export async function POST(req:Request){
    try {
        const { exercise, resultId  } = await req.json();
        const res = await fetch(`http://127.0.0.1:5000/evaluate/${exercise}`);

        const data = await res.json();
        
        const resultUpdated = await prisma.result.update({
            where:{
                result_id:Number(resultId),
            },
            data:{
                score:Number(data.accuracy)
            }
        });

        if(!resultUpdated) return NextResponse.json({success:false, message:'Result not saved.'});

        // const imageCreated = await prisma.result_image.createMany({
        //     data:[
        //         {
        //             result_id:resultCreated.result_id,
        //             image_name: 'image1',
        //             filepath: ''
        //         },
        //         {
        //             result_id:resultCreated.result_id,
        //             image_name: 'image2',
        //             filepath: ''
        //         },
        //         {
        //             result_id:resultCreated.result_id,
        //             image_name: 'image3',
        //             filepath: ''
        //         },
        //     ]
        // });

        // if (!imageCreated) return NextResponse.json({success:false, message:'Image not saved.'});

        return NextResponse.json({success:true});
    } catch (error) {
        return NextResponse.json({success:false, message:'Internal server error.'});
    }
}