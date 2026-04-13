import { promises as fs } from "fs";
import path from "path";
import type { MenuCategory, MenuResponse } from "@/types/menu";

const menuFilePath = path.join(process.cwd(), "data", "menu.json");

function normalizeMenu(data: MenuResponse): MenuResponse {
  return {
    categories: data.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        id: item.id ?? createItemId(category.name, item.name)
      }))
    }))
  };
}

export async function readMenuFile(): Promise<MenuResponse> {
  const fileContents = await fs.readFile(menuFilePath, "utf8");
  const parsed = JSON.parse(fileContents) as MenuResponse;
  return normalizeMenu(parsed);
}

export async function writeMenuFile(data: MenuResponse) {
  const normalized = normalizeMenu(data);
  await fs.writeFile(menuFilePath, JSON.stringify(normalized, null, 2));
}

export function createItemId(categoryName: string, itemName: string) {
  const slug = `${categoryName}-${itemName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `item-${Date.now()}`;
}

export function upsertItem(
  categories: MenuCategory[],
  categoryName: string,
  item: MenuCategory["items"][number]
) {
  const nextCategories = categories.map((category) => {
    if (category.name !== categoryName) {
      return category;
    }

    const existingIndex = category.items.findIndex(
      (entry) => entry.id === item.id
    );

    if (existingIndex === -1) {
      return {
        ...category,
        items: [...category.items, item]
      };
    }

    const items = [...category.items];
    items[existingIndex] = item;

    return {
      ...category,
      items
    };
  });

  if (nextCategories.some((category) => category.name === categoryName)) {
    return nextCategories;
  }

  return [
    ...nextCategories,
    {
      name: categoryName,
      items: [item]
    }
  ];
}
