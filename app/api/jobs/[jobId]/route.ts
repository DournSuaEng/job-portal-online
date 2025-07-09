
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { utapi } from "@/server/delete";

export async function PATCH(req: Request, { params }: { params: { jobId: string } }) {
    try {
        const { userId } = await auth();
        const { jobId } =await params; // No need for 'await' on params
        const updateValues = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!jobId) {
            return new NextResponse("Job ID is required", { status: 400 });
        }
        await db.job.update ({
            where: {
                id: jobId,
                userId,
            },data:{
                ...updateValues,
            }
        })

        

        console.log(`✅ Job ${jobId} deleted successfully!`);
        return new NextResponse("Job deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[JOB_SAVE] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE method for deleting a job id
export async function DELETE(req: Request, { params }: { params: { jobId: string } }) {
    try {
        const { userId } = await auth();
        const { jobId } =await params; // No need for 'await' on params

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!jobId) {
            return new NextResponse("Job ID is required", { status: 400 });
        }

        // Find job
        const job = await db.job.findUnique({
            where: { id: jobId, userId },
            include: { attachments: true },
        });

        if (!job) {
            return new NextResponse("Job not found", { status: 404 });
        }

        // Delete job image from UploadThing
        if (job.imageUrl) {
            try {
                const fileKey = job.imageUrl.split("/").pop();
                if (fileKey) await utapi.deleteFiles([fileKey]);
                console.log("✅ Image deleted from UploadThing!");
            } catch (error) {
                console.error(" UploadThing delete error:", error);
                return new NextResponse("Failed to delete image from UploadThing", { status: 500 });
            }
        }

        // Delete all attachments from UploadThing
        if (Array.isArray(job.attachments) && job.attachments.length > 0) {
            try {
                await Promise.all(
                    job.attachments.map(async (attachment) => {
                        const fileKey = attachment.url.split("/").pop();
                        if (fileKey) await utapi.deleteFiles([fileKey]);
                    })
                );
                console.log("✅ Attachments deleted from UploadThing!");
            } catch (error) {
                console.error(" Error deleting attachments:", error);
                return new NextResponse("Failed to delete attachments", { status: 500 });
            }
        }
        //Delete the attachment records from the mongodb
        await db.attachment.deleteMany({
            where: {
                jobId,
            },
        })
        // Delete job from database
        await db.job.deleteMany({ where: { id: jobId, userId } });

        console.log(`✅ Job ${jobId} deleted successfully!`);
        return new NextResponse("Job deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[JOB_DELETE] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
