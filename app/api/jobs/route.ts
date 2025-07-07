
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        // Await the auth function to get the user ID
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Parse the incoming request body to extract the job title and any other optional fields
        const { title, description, short_description, imageUrl ,ShiftTiming} = await req.json();

        // Check if the title is provided
        if (!title) {
            return new NextResponse("Title is missing", { status: 400 });
        }

        // Create the job in the database
        const job = await db.job.create({
            data: {
                userId, 
                title,
                description: description || "",  // Optional field with default value
                short_description: short_description || "",  // Optional field with default value
                imageUrl: imageUrl || "",  // Optional field with default value
                shiftTiming: ShiftTiming || "",

            },
        });

        // Return the newly created job as JSON
        return NextResponse.json(job);

    } catch (error) {
        // Log the error for debugging purposes
        console.error("[JOB_POST_Error]:", error);

        // Return a generic internal server error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
