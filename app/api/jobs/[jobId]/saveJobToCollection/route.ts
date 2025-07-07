import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } =await auth();
    const {jobId} = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    // Make sure user is not already in savedUsers
    const existingSavedUsers = job.savedUsers || [];
    if (existingSavedUsers.includes(userId)) {
      return new NextResponse("Job already saved", { status: 200 });
    }

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        savedUsers: {
          set: [...existingSavedUsers, userId],
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_SAVE_PATCH] Error:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
