import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } =await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const body = await req.json();

    if (!body || !Array.isArray(body.resumes) || body.resumes.length === 0) {
      return new NextResponse("Invalid resume data", { status: 400 });
    }

    const createdResumes: Resumes[] = [];

    for (const resume of body.resumes) {
      const { url, name } = resume;

      if (!url || !name) continue;

      const existingResume = await db.resumes.findFirst({
        where: {
         userProfileId: userId,
          url,
        },
      });

      if (existingResume) {
        console.log(`Resume with URL ${url} already exists for resumeId ${userId}`);
        continue;
      }

      const newResume = await db.resumes.create({
        data: {
          url,
          name,
          userProfileId: userId,
        },
      });

      createdResumes.push(newResume);
    }

    return NextResponse.json({ success: true, resumes: createdResumes }, { status: 200 });

  } catch (error) {
    console.error("[RESUME_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
