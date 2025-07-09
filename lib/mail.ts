// lib/mail.ts
import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import type { SentMessageInfo } from "nodemailer"; // Import specific type for nodemailer

// Load templates from files to reduce in-memory string size
const loadTemplate = async (templateName: string): Promise<string> => {
  const templatePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  const templateBuffer = await fs.readFile(templatePath);
  return templateBuffer.toString("utf-8");
};

/**
 * Compiles the "Thank You" email template with the given name.
 */
export const compileThankYouEmailTemplate = async (name: string): Promise<string> => {
  const templateContent = await loadTemplate("thank-you");
  const template = Handlebars.compile(templateContent);
  return template({ name });
};

/**
 * Compiles the "Selected" email template with the given name.
 */
export const compileSendSelectedEmailTemplate = async (name: string): Promise<string> => {
  const templateContent = await loadTemplate("send-selected");
  const template = Handlebars.compile(templateContent);
  return template({ name });
};

/**
 * Compiles the "Rejection" email template with the given name.
 */
export const compileSendRejectionEmailTemplate = async (name: string): Promise<string> => {
  const templateContent = await loadTemplate("send-rejection");
  const template = Handlebars.compile(templateContent);
  return template({ name });
};

/**
 * Sends an email using Nodemailer and Gmail SMTP.
 */
export const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<SentMessageInfo> => {
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
      html: body, // Use compiled HTML directly
    });

    return result;
  } catch (error) {
    console.error("Failed to send mail:", error);
    throw new Error("Failed to send email.");
  }
};