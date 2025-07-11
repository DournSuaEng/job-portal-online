
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { companyId: string } }) => {
    try {
        // Authenticate the user and get their ID (synchronously)
        const { userId } = await auth(); // No need to await auth()

        // Destructure the companyId from params
        const { companyId } =await params;

        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if companyId is provided
        if (!companyId) {
            return new NextResponse("Company ID is required", { status: 400 });
        }

        // Parse the incoming request body
        const updateValues = await req.json();

        // Validate the request body (optional but recommended)
        if (!updateValues || Object.keys(updateValues).length === 0) {
            return new NextResponse("No data provided for update", { status: 400 });
        }

        // Update the company in the database
        const updatedCompany = await db.company.update({
            where: {
                id: companyId,
                userId, // Ensure the company belongs to the authenticated user
            },
            data: {
                ...updateValues, // Spread the update values
            },
        });

        // Return the updated company as JSON
        return NextResponse.json(updatedCompany);
    } catch (error) {
        // Log the error for debugging purposes
        console.error("[COMPANY_PATCH_ERROR]:", error);

        // Return a generic internal server error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};