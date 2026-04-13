import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { createItemId, upsertItem } from "@/lib/menu-store";
import type { MenuItemPayload, MenuResponse } from "@/types/menu";

export const dynamic = "force-dynamic";

const COLLECTION_NAME = "menu";
const DEFAULT_MENU: MenuResponse = { categories: [] };

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    const menu = await collection.findOne({});

    if (!menu) {
      return NextResponse.json(DEFAULT_MENU, {
        headers: { "Cache-Control": "no-store" }
      });
    }

    const { _id, ...rest } = menu as any;
    return NextResponse.json(rest, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json(
      { error: "Unable to fetch menu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MenuItemPayload;
    const validation = validatePayload(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    let menu = await collection.findOne({});
    if (!menu) {
      menu = DEFAULT_MENU;
    }

    const item = {
      id: createItemId(body.categoryName, body.name),
      name: body.name,
      price: body.price,
      image: body.image,
      description: body.description
    };

    const categories = upsertItem(
      (menu as any).categories || [],
      body.categoryName,
      item
    );

    const result = await collection.findOneAndUpdate(
      {},
      { $set: { categories } },
      { upsert: true, returnDocument: "after" }
    );

    revalidatePath("/");
    revalidatePath("/admin");

    const { _id, ...rest } = (result.value || { categories }) as any;
    return NextResponse.json(rest, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("POST /api/menu error:", error);
    return NextResponse.json(
      { error: "Unable to update menu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as MenuItemPayload;
    const validation = validatePayload(body, true);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    let menu = await collection.findOne({});
    if (!menu) {
      menu = DEFAULT_MENU;
    }

    const categories = (menu as any).categories || [];
    const sourceCategory = categories.find((category: any) =>
      category.items.some((item: any) => item.id === body.id)
    );

    if (!sourceCategory) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const nextCategories = categories.map((category: any) => ({
      ...category,
      items: category.items.filter((item: any) => item.id !== body.id)
    }));

    const updatedCategories = upsertItem(nextCategories, body.categoryName, {
      id: body.id!,
      name: body.name,
      price: body.price,
      image: body.image,
      description: body.description
    });

    const result = await collection.findOneAndUpdate(
      {},
      { $set: { categories: updatedCategories } },
      { upsert: true, returnDocument: "after" }
    );

    revalidatePath("/");
    revalidatePath("/admin");

    const { _id, ...rest } = (result.value || { categories: updatedCategories }) as any;
    return NextResponse.json(rest, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("PUT /api/menu error:", error);
    return NextResponse.json(
      { error: "Unable to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };

    if (!body.id) {
      return NextResponse.json({ error: "Item id is required" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    let menu = await collection.findOne({});
    if (!menu) {
      menu = DEFAULT_MENU;
    }

    const categories = ((menu as any).categories || []).map((category: any) => ({
      ...category,
      items: category.items.filter((item: any) => item.id !== body.id)
    }));

    const result = await collection.findOneAndUpdate(
      {},
      { $set: { categories } },
      { upsert: true, returnDocument: "after" }
    );

    revalidatePath("/");
    revalidatePath("/admin");

    const { _id, ...rest } = (result.value || { categories }) as any;
    return NextResponse.json(rest, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("DELETE /api/menu error:", error);
    return NextResponse.json(
      { error: "Unable to delete menu item" },
      { status: 500 }
    );
  }
}

function validatePayload(
  payload: MenuItemPayload,
  requireId = false
): { valid: true } | { valid: false; error: string } {
  if (requireId && !payload.id) {
    return { valid: false, error: "Item id is required" };
  }

  if (!payload.categoryName.trim()) {
    return { valid: false, error: "Category name is required" };
  }

  if (!payload.name.trim()) {
    return { valid: false, error: "Item name is required" };
  }

  if (!payload.description.trim()) {
    return { valid: false, error: "Description is required" };
  }

  if (!payload.image.trim()) {
    return { valid: false, error: "Image path is required" };
  }

  if (Number.isNaN(payload.price) || payload.price <= 0) {
    return { valid: false, error: "Price must be greater than 0" };
  }

  return { valid: true };
}


  
