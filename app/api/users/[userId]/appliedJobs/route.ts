import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        const jobId = await req.text();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!jobId) {
            return new NextResponse("job Id is missing", { status: 401 });
        }

      

        let profile = await db.userProfile.findUnique({
            where: {
                 userId
                 },
        });

        if (!profile) {
            return new NextResponse("user profile not found", { status: 401 });
        }

        const updatedProfile = await db.userProfile.update({
            where: {
                userId
            },data: {
                    appliedJobs: {
                        push : {jobId}
                    }
            }
        })



        return NextResponse.json(updatedProfile)

    } catch (error) {
        console.error("[JOB_APPLIED_JOBS_PATCH] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
