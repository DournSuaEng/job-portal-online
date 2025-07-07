import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { utapi } from "@/server/delete";

export const DELETE = async (req: Request, { params }: { params: { resumeId:string } }) => {
    try {
        // Authenticate user
        const { userId } =await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Extract jobId & attachmentId
        const { resumeId } = await params;

        if (!resumeId) {
            return new NextResponse("Missing parameters", { status: 400 });
        }

        // Find attachment in DB
        const resume = await db.resumes.findUnique({
            where: { id: resumeId },
        });

        if (!resume) {
            return new NextResponse("Resume not found", { status: 404 });
        }

        // Delete file from UploadThing
        try {
            const fileKey = resume.url.split('/').pop();
            if (fileKey) {
                await utapi.deleteFiles([fileKey]); // Pass an array
                console.log("File deleted successfully from UploadThing!");
            }
        } catch (error) {
            console.error("UploadThing delete error:", error);
            return new NextResponse("Failed to delete file from UploadThing", { status: 500 });
        }

        // Delete attachment from database
        await db.resumes.delete({
            where: { id: resumeId },
        });

        return new NextResponse("Attachment deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[RESUME_ERROE]:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
