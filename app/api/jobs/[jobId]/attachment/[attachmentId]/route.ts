import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { utapi } from "@/server/delete";

export const DELETE = async (req: Request, { params }: { params: { jobId: string, attachmentId: string } }) => {
    try {
        // Authenticate user
        const { userId } =await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Extract jobId & attachmentId
        const { jobId, attachmentId } = await params;
        if (!jobId || !attachmentId) {
            return new NextResponse("Missing parameters", { status: 400 });
        }

        // Find attachment in DB
        const attachment = await db.attachment.findUnique({
            where: { id: attachmentId },
        });

        if (!attachment) {
            return new NextResponse("Attachment not found", { status: 404 });
        }

        // Delete file from UploadThing
        try {
            const fileKey = attachment.url.split('/').pop();
            if (fileKey) {
                await utapi.deleteFiles([fileKey]); // Pass an array
                console.log("File deleted successfully from UploadThing!");
            }
        } catch (error) {
            console.error("UploadThing delete error:", error);
            return new NextResponse("Failed to delete file from UploadThing", { status: 500 });
        }

        // Delete attachment from database
        await db.attachment.delete({
            where: { id: attachmentId },
        });

        return new NextResponse("Attachment deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[JOB_ATTACHMENT_DELETE_ERROR]:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
