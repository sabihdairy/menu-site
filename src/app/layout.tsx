import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "متجر صابح | منتجات ألبان وحلويات فاخرة",
  description: "أطيب المنتجات بين ايديك دلوقتي. تصفح تشكيلتنا المميزة واطلب عبر واتساب بضغطة واحدة.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
