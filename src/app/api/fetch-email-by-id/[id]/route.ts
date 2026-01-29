import { NextResponse } from "next/server";
// Make sure this points to your JSON file or store correctly
import emailsData from "@/mock-data/emails.json"; 
import { delay } from "@/utils/delay";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("🔥 HIT fetch-email-by-id API");

  // 1️⃣ Simulate latency
  await delay(Math.random() * 500);

  // 2️⃣ Await params (Required for Next.js 15+)
  const { id: emailId } = await context.params;

  // 3️⃣ Get query param "inbox" (Fixing the 400 Error)
  const { searchParams } = new URL(req.url);
  // ✅ FIX: Frontend sends "?inbox=...", so we must get "inbox"
  const inbox = searchParams.get("inbox"); 

  if (!inbox) {
    return NextResponse.json(
      { success: false, message: "Inbox parameter 'inbox' not specified" },
      { status: 400 }
    );
  }

  // 4️⃣ Find email
  // Note: We match 'to' against 'inbox' (or 'inbox@mailhey.com' if needed)
  const email = emailsData.find((e) => {
    // If inbox is "jeet" and email.to is "jeet", this works.
    // If frontend sends "jeet" but email.to is "jeet@mailhey.com", use .includes()
    return e.id === emailId && e.to.includes(inbox); 
  });

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email not found" },
      { status: 404 }
    );
  }

  // 5️⃣ Return response (Fixing the Structure Mismatch)
  // ✅ FIX: Return the object directly. Do NOT wrap in { data: ... }
  // Your frontend code does: "id: data.id", so "data" must be the object itself.
  return NextResponse.json({
    id: email.id,
    sender: email.from,
    recipient: email.to,
    subject: email.subject,
    body: email.body, // Text body
    body_html: `<p>${email.body}</p>`, // Mock HTML body so preview looks nice
    createdAt: email.createdAt,
    read: true, 
    attachments: [] // Empty array to prevent crashes if frontend expects it
  });
}