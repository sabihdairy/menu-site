"use server";

import { db } from "@/db";
import { products, settings, branches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Save settings action
export async function saveSettingsAction(data: {
  id: number;
  brandName: string;
  whatsapp: string;
  phone: string;
  facebook: string;
  tiktok: string;
  aboutUs: string;
  heroTitle: string;
  heroSubtitle: string;
  adminPassword?: string;
}) {
  try {
    const updateData: any = {
      brandName: data.brandName,
      whatsapp: data.whatsapp,
      phone: data.phone,
      facebook: data.facebook,
      tiktok: data.tiktok,
      aboutUs: data.aboutUs,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
    };

    if (data.adminPassword && data.adminPassword.trim() !== "") {
      updateData.adminPassword = data.adminPassword;
    }

    await db.update(settings).set(updateData).where(eq(settings.id, data.id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update settings", error);
    return { success: false, error: error.message };
  }
}

// Add product
export async function createProductAction(data: {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}) {
  try {
    await db.insert(products).values({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=400",
      isAvailable: true,
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create product", error);
    return { success: false, error: error.message };
  }
}

// Update product
export async function updateProductAction(data: {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}) {
  try {
    await db.update(products).set({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable,
    }).where(eq(products.id, data.id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product", error);
    return { success: false, error: error.message };
  }
}

// Delete product
export async function deleteProductAction(id: number) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product", error);
    return { success: false, error: error.message };
  }
}

// Save branch (create or update)
export async function saveBranchAction(data: {
  id?: number;
  name: string;
  address: string;
  mapsLink: string;
  phone: string;
  whatsapp: string;
}) {
  try {
    if (data.id) {
      await db.update(branches).set({
        name: data.name,
        address: data.address,
        mapsLink: data.mapsLink,
        phone: data.phone,
        whatsapp: data.whatsapp,
      }).where(eq(branches.id, data.id));
    } else {
      await db.insert(branches).values({
        name: data.name,
        address: data.address,
        mapsLink: data.mapsLink,
        phone: data.phone,
        whatsapp: data.whatsapp,
      });
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save branch", error);
    return { success: false, error: error.message };
  }
}

// Delete branch
export async function deleteBranchAction(id: number) {
  try {
    await db.delete(branches).where(eq(branches.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete branch", error);
    return { success: false, error: error.message };
  }
}
