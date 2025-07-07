
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request, { params }: { params: { jobId: string } }) => {
    try {
        // Get authenticated user ID
        const authData =await auth();
        if (!(await authData)?.userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get jobId from request parameters
        const { jobId } =await params;
        if (!jobId) {
            return new NextResponse("Job ID is missing", { status: 400 });
        }

        // Parse request body
        const body = await req.json();
        if (!body || !body.attachments || !Array.isArray(body.attachments) || body.attachments.length === 0) {
            return new NextResponse("Invalid attachments data", { status: 400 });
        }

        // Process and store valid attachments
        const createdAttachments: Attachment[] = [];
        for (const attachment of body.attachments) {
            const { url, name } = attachment;

        const existingAttachment = await db.attachment.findFirst({
            where: {
                jobId,
                url
            }
        })
        if(existingAttachment){
            //skip the insertion 
            console.log(`Attachment with URL ${url} already exists for jobId ${jobId}`)
            continue
        }
         
            const createdAttachment = await db.attachment.create({
                data: {
                    url,
                    name,
                    jobId,
                },
            });

            createdAttachments.push(createdAttachment);
        }

        return NextResponse.json({ success: true, attachments: createdAttachments }, { status: 200 });

    } catch (error) {
        console.error("[JOB_ATTACHMENT_POST_ERROR]:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
