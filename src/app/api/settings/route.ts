import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { normalizeSettings, validateSettingsPayload } from "@/lib/settings-store";
import type { Settings } from "@/types/settings";

export const dynamic = "force-dynamic";

const COLLECTION_NAME = "settings";

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    const settings: any = await collection.findOne({});

    const responseData = normalizeSettings((settings || {}) as any);
    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Unable to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Settings>;
    const validation = validateSettingsPayload(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    // Upsert to maintain single document
    const result: any = await collection.findOneAndUpdate(
      {},
      { $set: validation.data },
      { upsert: true, returnDocument: "after" }
    );

    revalidatePath("/");
    revalidatePath("/admin");

    // Remove MongoDB _id from response
    const { _id, ...rest } = (result.value || validation.data) as any;
    return NextResponse.json(rest, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json(
      { error: "Unable to update settings" },
      { status: 500 }
    );
  }
}
