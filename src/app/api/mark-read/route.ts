import { NextResponse } from "next/server";
import { emailStore } from "@/mock-data/emailStore";

export async function POST(req: Request) {
  try {
    const { emailId } = await req.json();

    if (!emailId) {
      return NextResponse.json(
        { error: "emailId is required" },
        { status: 400 }
      );
    }

    const email = emailStore.find((e) => e.id === emailId);

    if (!email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      );
    }

    // ✅ mutate shared mock store (acts like DB update)
    email.read = true;

    return NextResponse.json({
      success: true,
      message: "Email marked as read",
      emailId,
    });
  } catch (error) {
    console.error("mark-read error:", error);
    return NextResponse.json(
      { error: "Failed to mark email as read" },
      { status: 500 }
    );
  }
}
