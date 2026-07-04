import { pgTable, serial, text, boolean, integer, numeric, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // e.g., 'أطباق سوبر', 'حلويات', 'عصائر'
  imageUrl: text("image_url").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").default("صابح").notNull(),
  whatsapp: text("whatsapp").default("201091015366").notNull(),
  phone: text("phone").default("0503600613").notNull(),
  facebook: text("facebook").default("https://www.facebook.com/sabih.dairy").notNull(),
  tiktok: text("tiktok").default("https://www.tiktok.com/@sabih.dairy").notNull(),
  aboutUs: text("about_us").default("نحن متجر متخصص في تقديم أفضل المنتجات بجودة عالية وأسعار مناسبة. هدفنا هو راحة عملائنا من أول لحظة تصفح إلى استلام الطلب. تقدر تطلب أي منتج بسهولة وسيتم التواصل معك مباشرة عبر واتساب لتأكيد الطلب والتوصيل.").notNull(),
  heroTitle: text("hero_title").default("أطيب المنتجات بين ايديك دلوقتي").notNull(),
  heroSubtitle: text("hero_subtitle").default("تصفح تشكيلتنا المميزة واختر ما يعجبك، وأرسل طلبك مباشرة عبر واتساب بضغطة واحدة.").notNull(),
  adminPassword: text("admin_password").default("sabih123").notNull(),
});

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  mapsLink: text("maps_link").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
});
