import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { companyId: string } }) => {
  try {
    const { userId } =await auth();
    const companyId = params.companyId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const currentFollowers: string[] = company.followers || [];

    if (currentFollowers.includes(userId)) {
      return new NextResponse("Already following this company", { status: 400 });
    }

    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        followers: {
          set: [...currentFollowers, userId],
        },
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[COMPANY_PATCH_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
