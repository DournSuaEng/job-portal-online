import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { ThankYouTemplate } from "./designs/thank-you";
import { SendSelectedTemplate } from "./designs/send-selected-template";
import { SendRejectionTemplate } from "./designs/send-rejection-template";

/**
 * Compiles the "Thank You" email template with the given name.
 */
export const compileThankYouEmailTemplate = (name: string): string => {
  const template = handlebars.compile(ThankYouTemplate);
  return template({ name });
};
export const compileSendSelectedEmialTemplate = (name: string): string => {
  const template = handlebars.compile(SendSelectedTemplate);
  return template({ name });
};
export const compileSendRejectionEmailTemplate = (name: string): string => {
  const template = handlebars.compile(SendRejectionTemplate);
  return template({ name });
};

/**
 * Sends an email using Nodemailer and Gmail SMTP.
 */
export const sendMail = async ({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    console.error("Missing SMTP credentials in environment variables.");
    throw new Error("Missing SMTP credentials.");
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.verify();
  } catch (error) {
    console.error("SMTP verification failed:", error);
    throw new Error("SMTP configuration error.");
  }

  try {
    const result = await transport.sendMail({
      from: `"Job Portal" <${SMTP_EMAIL}>`,
      to,
      subject,
      html: `<p>Hi ${name},</p><p>${body}</p>`,
    });

    return result;
  } catch (error) {
    console.error("Failed to send mail:", error);
    throw new Error("Failed to send email.");
  }
};
