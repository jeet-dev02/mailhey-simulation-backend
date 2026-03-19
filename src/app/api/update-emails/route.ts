/**
 * @openapi
 * /update-emails:
 *   put:
 *     summary: Update multiple emails
 *     description: Updates one or more emails by merging provided fields based on email ID
 *     tags: [Emails]
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   example: e1
 *                   description: ID of the email to update
 *                 subject:
 *                   type: string
 *                   example: Updated Subject
 *                 body:
 *                   type: string
 *                   example: Updated email body
 *                 read:
 *                   type: boolean
 *                   example: true
 *     
 *     responses:
 *       200:
 *         description: Emails updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Emails updated successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       
 *       400:
 *         description: Invalid payload format
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
 *                   example: Invalid payload format
 *       
 *       500:
 *         description: Server error
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
 *                   example: Failed to update emails
 */


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
