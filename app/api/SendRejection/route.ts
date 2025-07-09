import { compileSendRejectionEmailTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

/**
 * POST /api/SendRejection
 * Sends a rejection email to a job applicant.
 */
export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const { email, fullName } = await req.json();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Missing email or full name." },
        { status: 400 }
      );
    }

    const htmlBody = compileSendRejectionEmailTemplate(fullName);

    const response = await sendMail({
      to: email,
      name: fullName,
      subject: "Application Update!",
      body: htmlBody,
    });

    if (response?.messageId) {
      return NextResponse.json({ message: "Mail delivered" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Mail not sent" }, { status: 500 });
    }

  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      console.error("Mail API error:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Mail API error:", error);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
};
