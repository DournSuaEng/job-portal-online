import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
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

    const savedUsers = job.savedUsers || [];
    const userIndex = savedUsers.indexOf(userId);

    if (userIndex === -1) {
      return new NextResponse("User has not saved this job", { status: 400 });
    }

    const updatedJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        savedUsers: {
          set: savedUsers.filter((savedUserId) => savedUserId !== userId),
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_REMOVE_SAVED_PATCH] Error:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
