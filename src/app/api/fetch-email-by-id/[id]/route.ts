/**
 * @openapi
 * /fetch-email-by-id/{id}:
 *   get:
 *     summary: Get a single email by ID
 *     description: Fetch a specific email using its ID and inbox username
 *     tags: [Emails]
 *     
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: e1
 *         description: Unique ID of the email
 *       
 *       - in: query
 *         name: inbox
 *         required: true
 *         schema:
 *           type: string
 *         example: user
 *         description: Inbox username to verify email ownership
 *     
 *     responses:
 *       200:
 *         description: Email fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: e1
 *                 sender:
 *                   type: string
 *                   example: admin@mailhey.com
 *                 recipient:
 *                   type: string
 *                   example: jeet
 *                 subject:
 *                   type: string
 *                   example: Welcome to MailHey
 *                 body:
 *                   type: string
 *                   example: Your inbox is ready.
 *                 body_html:
 *                   type: string
 *                   example: "<p>Your inbox is ready.</p>"
 *                 createdAt:
 *                   type: string
 *                   example: 2026-01-15T10:00:00Z
 *                 read:
 *                   type: boolean
 *                   example: true
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: object
 *       
 *       400:
 *         description: Missing inbox parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Inbox parameter 'inbox' not specified
 *       
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email not found
 */



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