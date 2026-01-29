import { NextRequest, NextResponse } from "next/server";
import { emailStore, MockEmail } from "@/mock-data/emailStore";
import { delay } from "@/utils/delay";

export async function PUT(req: NextRequest) {
  console.log("🔥 HIT update-emails API");

  try {
    await delay(500);

    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload format" },
        { status: 400 }
      );
    }

    body.forEach((updatedEmail: Partial<MockEmail> & { id: string }) => {
      const index = emailStore.findIndex((e) => e.id === updatedEmail.id);

      if (index !== -1) {
        emailStore[index] = {
          ...emailStore[index],
          ...updatedEmail,
        };
      }
    });

    return NextResponse.json({
      success: true,
      message: "Emails updated successfully",
      data: emailStore,
    });
  } catch (err) {
    console.error("❌ update-emails error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update emails" },
      { status: 500 }
    );
  }
}
