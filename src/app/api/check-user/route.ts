/**
 * @openapi
 * /check-user:
 *   post:
 *     summary: Check if a user exists and generate token
 *     description: Validates username, checks existence, and returns JWT if user exists
 *     tags: [User]
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: user
 *                 description: Username to check
 *     
 *     responses:
 *       200:
 *         description: User check completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 exists:
 *                   type: boolean
 *                   example: true
 *                 username:
 *                   type: string
 *                   example: user
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 cached:
 *                   type: boolean
 *                   example: false
 *       
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid username
 *       
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */



// src/app/api/check-user/route.ts
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { emailStore } from "@/mock-data/emailStore";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// simple in-memory cache (HMR-safe)
const cache: Record<string, "1" | "0"> =
  (globalThis as any).__CHECK_USER_CACHE__ ??
  ((globalThis as any).__CHECK_USER_CACHE__ = {});

async function generateJWT(username: string) {
  return await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET);
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    // -------- INPUT VALIDATION (mirrors real API) --------
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { exists: false, error: "Invalid username" },
        { status: 400 }
      );
    }

    const cleanName = name.trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { exists: false, error: "Username length invalid" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9._-]+$/.test(cleanName)) {
      return NextResponse.json(
        { exists: false, error: "Invalid characters in username" },
        { status: 400 }
      );
    }

    // -------- CACHE CHECK --------
    if (cache[cleanName]) {
      if (cache[cleanName] === "1") {
        const token = await generateJWT(cleanName);
        return NextResponse.json({
          success: true,
          exists: true,
          username: cleanName,
          token,
          cached: true,
        });
      }

      return NextResponse.json({
        success: true,
        exists: false,
        username: cleanName,
        cached: true,
      });
    }

    // -------- MOCK "DB" CHECK --------
    const exists = emailStore.some(
      (email) => email.to.toLowerCase() === cleanName
    );

    cache[cleanName] = exists ? "1" : "0";

    if (!exists) {
      return NextResponse.json({
        success: true,
        exists: false,
        username: cleanName,
        cached: false,
      });
    }

    const token = await generateJWT(cleanName);

    return NextResponse.json({
      success: true,
      exists: true,
      username: cleanName,
      token,
      cached: false,
    });
  } catch (err) {
    console.error("CHECK-USER MIRROR ERROR:", err);
    return NextResponse.json(
      { exists: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
