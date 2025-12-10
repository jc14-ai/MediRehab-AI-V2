import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fullname, birthDate, gender, contact, email, address, profilePic, username, password, role } = data;

    console.log("Received doctor registration data:", { fullname, birthDate, gender, contact, email, username, role });

    const existingUsername = await prisma.account.findUnique({
      where: { username: username },
    });

    if (existingUsername) {
      console.error("Username already exists:", username);
      return NextResponse.json({ success: false, message: "Username already exists." });
    }

    const existingEmail = await prisma.doctor.findUnique({
      where: { email: email },
    });

    if (existingEmail) {
      console.error("Email already exists:", email);
      return NextResponse.json({ success: false, message: "Email already exists." });
    }

    const existingContact = await prisma.doctor.findUnique({
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

    const newDoctor = await prisma.doctor.create({
      data: {
        account_id: account.account_id,
        full_name: fullname,
        birth_date: new Date(birthDate),
        gender: gender,
        contact: contact,
        email: email,
        address: address,
      },
      select: {
        doctor_id: true,
      },
    });

    console.log("Created doctor_id:", newDoctor.doctor_id);

    const doctorImage = await prisma.user_image.create({
      data: {
        account_id: account.account_id,
        image_name: profilePic || "default.png",
        filepath: profilePic || "default.png",
      },
    });

    console.log("Created user_image");

    return NextResponse.json({ success: true, message: "Doctor registered successfully.", doctor: newDoctor });
  } catch (error) {
    console.error("Error in register_doctor:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json({
          success: false,
          message: "Username, email, or contact number already exists.",
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    select: {
      doctor_id: true,
      full_name: true,
      birth_date: true,
      gender: true,
      contact: true,
      email: true,
      address: true,
    },
  });

  return NextResponse.json(doctors);
}