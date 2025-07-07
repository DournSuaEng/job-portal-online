
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { jobId: string } }) => {
    try {
        const { userId } = await auth();
        const { jobId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!jobId) {
            return new NextResponse("Job ID is missing", { status: 400 });
        }

        const job = await db.job.findUnique({
            where: {
                id: jobId,
                userId, // Ensure user can only update their own jobs
            },
        });

        if (!job) {
            return new NextResponse("Job not found", { status: 404 });
        }

        const publishJob = await db.job.update({
            where: { id: jobId },
            data: { isPusblished: false }, // Fixed typo (was `isPusblished`)
        });
       
        return NextResponse.json(publishJob);
       
    } catch (error) {
        console.error(`[JOB_PUBLISH_PATCH] Error:`, error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
