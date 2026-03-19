/**
 * @openapi
 * /mark-read:
 *   post:
 *     summary: Mark an email as read
 *     description: Updates the read status of an email using its ID
 *     tags: [Emails]
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailId
 *             properties:
 *               emailId:
 *                 type: string
 *                 example: e1
 *                 description: ID of the email to mark as read
 *     
 *     responses:
 *       200:
 *         description: Email marked as read successfully
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
 *                   example: Email marked as read
 *                 emailId:
 *                   type: string
 *                   example: e1
 *       
 *       400:
 *         description: Missing emailId in request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: emailId is required
 *       
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email not found
 *       
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to mark email as read
 */

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
