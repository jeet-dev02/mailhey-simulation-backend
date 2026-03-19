/**
 * @openapi
 * /fetch-emails:
 *   get:
 *     summary: Get emails for a user
 *     tags: [Emails]
 *     parameters:
 *       - in: query
 *         name: recipient
 *         required: true
 *         schema:
 *           type: string
 *         
 *     responses:
 *       200:
 *         description: Emails fetched successfully
 */

import { NextResponse } from "next/server";
import emailsData from "@/mock-data/emails.json"; 
import { delay } from "@/utils/delay";

export async function GET(req: Request) {
  // 1️⃣ Simulate backend latency
  await delay(300);

  // 2️⃣ Parse query params
  const { searchParams } = new URL(req.url);
  const recipient = searchParams.get("recipient"); 
  const query = searchParams.get("query")?.toLowerCase() || ""; // ✅ Get the search query
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  
  // 3️⃣ Validate recipient
  if (!recipient) {
    return NextResponse.json(
      { success: false, message: "Inbox recipient not specified" },
      { status: 400 }
    );
  }

  const usernameOnly = recipient.split("@")[0];

  // 4️⃣ Filter by User FIRST
  let filteredEmails = emailsData.filter(
    (email) => email.to === usernameOnly
  );

  // 5️⃣ ✅ KEY FIX: Apply Search Filter (Subject or Sender)
  if (query) {
    filteredEmails = filteredEmails.filter((email) => 
      email.subject.toLowerCase().includes(query) || 
      email.from.toLowerCase().includes(query)
    );
  }

  // 6️⃣ Pagination Logic
  const limit = 10;
  const offset = (page - 1) * limit;
  const paginatedEmails = filteredEmails.slice(offset, offset + limit);

  // 7️⃣ Return response
  return NextResponse.json({
    emails: paginatedEmails.map((email) => ({
      id: email.id,
      sender: email.from,
      recipient: email.to,
      subject: email.subject,
      snippet: email.body.slice(0, 50) + "...",
      body_text: email.body,
      date_received: email.createdAt,
      read: false, 
    })),
    currentPage: page,
    totalPages: Math.ceil(filteredEmails.length / limit) || 1,
  });
}