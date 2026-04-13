import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type ContentDocument = {
  heroTitle: string;
  heroSubtitle: string;
  whyChooseUs: string[];
  footerText: string;
  bestSellers: { title: string; subtitle: string; items: string[] };
  weeklyOffers: { title: string; subtitle: string; items: string[] };
};

const COLLECTION_NAME = "content";
const DEFAULT_CONTENT: ContentDocument = {
  heroTitle: "",
  heroSubtitle: "",
  whyChooseUs: [],
  footerText: "",
  bestSellers: { title: "", subtitle: "", items: [] },
  weeklyOffers: { title: "", subtitle: "", items: [] }
};

function normalizeContent(data: Partial<ContentDocument>): ContentDocument {
  return {
    heroTitle: data.heroTitle ?? DEFAULT_CONTENT.heroTitle,
    heroSubtitle: data.heroSubtitle ?? DEFAULT_CONTENT.heroSubtitle,
    whyChooseUs: Array.isArray(data.whyChooseUs) ? data.whyChooseUs : DEFAULT_CONTENT.whyChooseUs,
    footerText: data.footerText ?? DEFAULT_CONTENT.footerText,
    bestSellers: data.bestSellers ? {
      title: data.bestSellers.title ?? DEFAULT_CONTENT.bestSellers.title,
      subtitle: data.bestSellers.subtitle ?? DEFAULT_CONTENT.bestSellers.subtitle,
      items: Array.isArray(data.bestSellers.items) ? data.bestSellers.items : DEFAULT_CONTENT.bestSellers.items
    } : DEFAULT_CONTENT.bestSellers,
    weeklyOffers: data.weeklyOffers ? {
      title: data.weeklyOffers.title ?? DEFAULT_CONTENT.weeklyOffers.title,
      subtitle: data.weeklyOffers.subtitle ?? DEFAULT_CONTENT.weeklyOffers.subtitle,
      items: Array.isArray(data.weeklyOffers.items) ? data.weeklyOffers.items : DEFAULT_CONTENT.weeklyOffers.items
    } : DEFAULT_CONTENT.weeklyOffers
  };
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);
    const document = await collection.findOne({});

    const responseData = normalizeContent((document || {}) as Partial<ContentDocument>);
    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json(
      { error: "Unable to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContentDocument>;
    const content = normalizeContent(body);

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.findOneAndUpdate(
      {},
      { $set: content },
      { upsert: true, returnDocument: "after" }
    );

    const { _id, ...rest } = (result || content) as any;
    return NextResponse.json(rest, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("POST /api/content error:", error);
    return NextResponse.json(
      { error: "Unable to update content" },
      { status: 500 }
    );
  }
}
