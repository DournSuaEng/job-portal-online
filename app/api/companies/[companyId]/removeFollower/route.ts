import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, props: { params: Promise<{ companyId: string }> }) => {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { companyId } = params;

    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company Not Found", { status: 404 });
    }

    const userIndex = company.followers.indexOf(userId);

    if (userIndex !== -1) {
      const updatedCompany = await db.company.update({
        where: {
          id: companyId,
        },
        data: {
          followers: {
            set: company.followers.filter((followerId) => followerId !== userId),
          },
        },
      });

      return new NextResponse(JSON.stringify(updatedCompany), { status: 200 });
    } else {
      return new NextResponse("User is not a follower", { status: 400 });
    }
  } catch (error) {
    console.error("[COMPANY_PATCH_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
