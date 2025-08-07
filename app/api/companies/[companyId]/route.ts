import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;
    const body = await request.json();
    // Example: Update company in database using Prisma
    // Replace with your actual logic
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: body,
    });
    return NextResponse.json(updatedCompany);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}