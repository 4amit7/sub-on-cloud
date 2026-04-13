import { promises as fs } from "fs";
import path from "path";
import type { Settings } from "@/types/settings";

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

const defaultSettings: Settings = {
  logo: "/images/logo.png",
  phone: "9999999999",
  whatsapp: "919999999999",
  address: "Manjalpur, Vadodara",
  email: "",
  instagram: "",
  facebook: "",
  twitter: "",
  zomato: "",
  swiggy: "",
  openingHours: "11 AM - 11 PM"
};

export function normalizeSettings(data: Partial<Settings>): Settings {
  return {
    logo: data.logo ?? defaultSettings.logo,
    phone: data.phone ?? defaultSettings.phone,
    whatsapp: data.whatsapp ?? defaultSettings.whatsapp,
    address: data.address ?? defaultSettings.address,
    email: data.email ?? defaultSettings.email,
    instagram: data.instagram ?? defaultSettings.instagram,
    facebook: data.facebook ?? defaultSettings.facebook,
    twitter: data.twitter ?? defaultSettings.twitter,
    zomato: data.zomato ?? defaultSettings.zomato,
    swiggy: data.swiggy ?? defaultSettings.swiggy,
    openingHours: data.openingHours ?? defaultSettings.openingHours
  };
}

export async function readSettingsFile(): Promise<Settings> {
  const fileContents = await fs.readFile(settingsFilePath, "utf8");
  const parsed = JSON.parse(fileContents) as Partial<Settings>;
  return normalizeSettings(parsed);
}

export async function writeSettingsFile(data: Partial<Settings>) {
  const normalized = normalizeSettings(data);
  await fs.writeFile(settingsFilePath, JSON.stringify(normalized, null, 2));
  return normalized;
}

export function validateSettingsPayload(
  payload: Partial<Settings>
): { valid: true; data: Settings } | { valid: false; error: string } {
  const normalized = normalizeSettings(payload);

  if (!normalized.logo.trim()) {
    return { valid: false, error: "Logo is required" };
  }

  if (!normalized.phone.trim()) {
    return { valid: false, error: "Phone is required" };
  }

  if (!normalized.whatsapp.trim()) {
    return { valid: false, error: "WhatsApp is required" };
  }

  if (!normalized.address.trim()) {
    return { valid: false, error: "Address is required" };
  }

  if (!normalized.openingHours.trim()) {
    return { valid: false, error: "Opening hours are required" };
  }

  return {
    valid: true,
    data: normalized
  };
}
