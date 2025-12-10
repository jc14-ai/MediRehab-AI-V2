import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, birthDate, gender, contact, email, address, profilePic, username, password, role, doctorId } = body;

    console.log("Received registration data:", { fullName, birthDate, gender, contact, email, username, role, doctorId });

    const existingUsername = await prisma.account.findUnique({
      where: { username: username },
    });

    if (existingUsername) {
      console.error("Username already exists:", username);
      return NextResponse.json({ success: false, message: "Username already exists." });
    }

    const existingEmail = await prisma.patient.findUnique({
      where: { email: email },
    });

    if (existingEmail) {
      console.error("Email already exists:", email);
      return NextResponse.json({ success: false, message: "Email already exists." });
    }

    const existingContact = await prisma.patient.findUnique({
      where: { contact: contact },
    });

    if (existingContact) {
      console.error("Contact number already exists:", contact);
      return NextResponse.json({ success: false, message: "Contact number already exists." });
    }

    const accountRole = await prisma.roles.findFirst({
      where: {
        role: role,
      },
      select: {
        role_id: true,
      },
    });

    if (!accountRole) {
      console.error("Role not found:", role);
      return NextResponse.json({ success: false, message: "Role not found." });
    }

    console.log("Found role_id:", accountRole.role_id);

    const account = await prisma.account.create({
      data: {
        username: username,
        password: password,
        registration_date: new Date(),
        role_id: accountRole.role_id,
      },
      select: {
        account_id: true,
      },
    });

    console.log("Created account_id:", account.account_id);

    const newPatient = await prisma.patient.create({
      data: {
        account_id: account.account_id,
        full_name: fullName,
        birth_date: new Date(birthDate),
        gender: gender,
        contact: contact,
        email: email,
        address: address,
      },
      select: {
        patient_id: true,
      },
    });

    console.log("Created patient_id:", newPatient.patient_id);

    const patientImage = await prisma.user_image.create({
      data: {
        account_id: account.account_id,
        image_name: profilePic,
        filepath: profilePic,
      },
    });

    console.log("Created user_image");

    const doctorPatient = await prisma.doctors_patient.create({
      data: {
        doctor_id: Number(doctorId),
        patient_id: newPatient.patient_id,
      },
    });

    console.log("Created doctors_patient link");

    return NextResponse.json({ success: true, message: "Patient registered successfully." });
  } catch (error) {
    console.error("Error in register_patient:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json({ 
          success: false, 
          message: "Email or contact number already exists." 
        });
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error.", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}

export async function GET() {
  const patients = await prisma.patient.findMany();
  return NextResponse.json(patients);
}