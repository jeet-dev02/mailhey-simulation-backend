// app/api/fetch-user-screen/route.ts
import { NextResponse } from "next/server";
import { emailStore } from "@/mock-data/emailStore";

export async function GET() {
  try {
    // Collect unique usernames from mock emails
    const users = Array.from(
      new Set(
        emailStore
          .map((email) => email.to?.trim())
          .filter(Boolean)
      )
    )
      .slice(0, 20)
      .map((username) => `${username}@mailhey.com`);

    // Fallback if no users found
    if (users.length === 0) {
      const fallbackEmails = [
        "alex@mailhey.com",
        "sophie@mailhey.com",
        "john.doe@mailhey.com",
        "emma123@mailhey.com",
        "tester@mailhey.com",
        "randomuser@mailhey.com",
        "guest@mailhey.com",
        "demo1@mailhey.com",
        "demo2@mailhey.com",
        "demo3@mailhey.com",
        "demo4@mailhey.com",
        "demo5@mailhey.com",
        "demo6@mailhey.com",
        "demo7@mailhey.com",
        "demo8@mailhey.com",
        "demo9@mailhey.com",
        "demo10@mailhey.com",
        "demo11@mailhey.com",
        "demo12@mailhey.com",
      ];

      return NextResponse.json({ emails: fallbackEmails });
    }

    return NextResponse.json({ emails: users });
  } catch (err) {
    console.error("fetch-user-screen mirror error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
