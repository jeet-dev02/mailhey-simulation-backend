import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "swagger.json");
    const file = fs.readFileSync(filePath, "utf-8");
    const spec = JSON.parse(file);

    return NextResponse.json(spec);
  } catch (error) {
    console.error("Swagger error:", error);
    return NextResponse.json(
      { error: "Failed to load Swagger spec" },
      { status: 500 }
    );
  }
}