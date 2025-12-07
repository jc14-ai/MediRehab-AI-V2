import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { image, patientId, assignId, resultId } = await req.json();

    const base64 = image.replace(/^data:image\/png;base64,/, "");
    const fileName = `screenshot_${Date.now()}${patientId}.png`;

    const filePath = path.join(process.cwd(), "public", "screenshots", patientId, fileName);

    await writeFile(filePath, base64, "base64");

    const imageCreated = await prisma.result_image.create({
      data:{
        image_name:fileName,
        filepath:`/screenshots/${patientId}/${fileName}`,
        result_id: Number(resultId)
      }
    });
    
    if(!imageCreated) return NextResponse.json({success:false, message:'Image not saved.'});

    return  NextResponse.json({ success: true, file: fileName });
  } catch (error: any) {
    return NextResponse.json({ success: false, error }, {status: 500});
  }
}
