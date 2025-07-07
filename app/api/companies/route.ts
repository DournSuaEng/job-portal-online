// In the backend (API route)

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { log } from "console";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the incoming request body
    const { name, description, logo, coverImage, mail, website, linkedIn, address_line_1, address_line_2, city, state, zipcode } = await req.json();

    // Validate required fields
    if (!name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create the company in the database
    const job= await db.company.create({
      data: {
        userId,
        name,
        description: description || "",
        logo: logo || "",
        coverImage : coverImage || "",
        mail : mail || "",
        website: website || "",
        linkedIn: linkedIn || "",
        address_line_1: address_line_1 || "",
        address_line_2 : address_line_2 || "",
        city: city || "",
        state: state || "",
        zipcode : zipcode || "",
      },
    });

    // Return the newly created company
    return NextResponse.json(job);
  } catch (error) {
    console.error("[COMPANY_POST_Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
