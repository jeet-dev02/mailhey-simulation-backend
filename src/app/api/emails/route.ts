// src/app/api/emails/route.ts
import { NextResponse } from "next/server";
import emails from "@/mock-data/emails.json";
import { delay } from "@/utils/delay";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  // simulate backend latency
  await delay(Math.random() * 1500);

  const userEmails = user
    ? emails.filter(e => e.to === user)
    : emails;

  return NextResponse.json({
    success: true,
    data: userEmails
  });
}
