import { compileThankYouEmailTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

/**
 * POST /api/thankyou
 * Sends a thank-you email to a job applicant.
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

    const htmlBody = compileThankYouEmailTemplate(fullName);

    const response = await sendMail({
      to: email,
      name: fullName,
      subject: "Thank you for applying",
      body: htmlBody,
    });

    if (response?.messageId) {
      return NextResponse.json({ message: "Mail delivered" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Mail not sent" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Mail API error:", error?.message || error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
