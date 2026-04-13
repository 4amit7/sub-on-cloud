import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    // Use a lightweight command to ensure the connection is alive.
    await db.command({ ping: 1 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MongoDB test connection failed:", error);
    return NextResponse.json(
      { success: false, error: "Unable to connect to MongoDB." },
      { status: 500 }
    );
  }
}
