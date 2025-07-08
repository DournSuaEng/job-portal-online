import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const values = await req.json();

        const profile = await db.userProfile.findUnique({
            where: { userId },
        });

        if (profile) {
            await db.userProfile.update({
                where: { userId },
                data: { ...values },
            });
        } else {
            await db.userProfile.create({
                data: {
                    userId,
                    ...values,
                },
            });
        }

        console.log(`User profile for ${userId} saved successfully.`);
        return new NextResponse("Profile saved successfully", { status: 200 });

    } catch (error) {
        console.error("[USER_PROFILE_SAVE] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
