import { db } from "./index";
import { products, settings, branches } from "./schema";
import { eq } from "drizzle-orm";

export async function getSettings() {
  try {
    let result = await db.select().from(settings).limit(1);
    if (result.length === 0) {
      // Seed default settings
      const [newSettings] = await db.insert(settings).values({
        brandName: "صابح",
        whatsapp: "201091015366",
        phone: "0503600613",
        facebook: "https://www.facebook.com/sabih.dairy",
        tiktok: "https://www.tiktok.com/@sabih.dairy",
        aboutUs: "نحن متجر متخصص في تقديم أفضل المنتجات بجودة عالية وأسعار مناسبة. هدفنا هو راحة عملائنا من أول لحظة تصفح إلى استلام الطلب. تقدر تطلب أي منتج بسهولة وسيتم التواصل معك مباشرة عبر واتساب لتأكيد الطلب والتوصيل.",
        heroTitle: "أطيب المنتجات بين ايديك دلوقتي",
        heroSubtitle: "تصفح تشكيلتنا المميزة واختر ما يعجبك، وأرسل طلبك مباشرة عبر واتساب بضغطة واحدة.",
        adminPassword: "sabih123",
      }).returning();
      return newSettings;
    }
    return result[0];
  } catch (error) {
    console.error("Error getting settings:", error);
    return {
      id: 1,
      brandName: "صابح",
      whatsapp: "201091015366",
      phone: "0503600613",
      facebook: "https://www.facebook.com/sabih.dairy",
      tiktok: "https://www.tiktok.com/@sabih.dairy",
      aboutUs: "نحن متجر متخصص في تقديم أفضل المنتجات بجودة عالية وأسعار مناسبة. هدفنا هو راحة عملائنا من أول لحظة تصفح إلى استلام الطلب. تقدر تطلب أي منتج بسهولة وسيتم التواصل معك مباشرة عبر واتساب لتأكيد الطلب والتوصيل.",
      heroTitle: "أطيب المنتجات بين ايديك دلوقتي",
      heroSubtitle: "تصفح تشكيلتنا المميزة واختر ما يعجبك، وأرسل طلبك مباشرة عبر واتساب بضغطة واحدة.",
      adminPassword: "sabih123",
    };
  }
}

export async function getProducts() {
  try {
    let result = await db.select().from(products).orderBy(products.id);
    if (result.length === 0) {
      // Seed initial products
      const initialProducts = [
        {
          name: "طبق فاكهة ملكي",
          price: "65.00",
          category: "أطباق سوبر",
          imageUrl: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "طبق فاكهة طازجة وغنية بالكريمة الفاخرة والمكسرات",
        },
        {
          name: "كوب فواكه بالكريمة",
          price: "55.00",
          category: "أطباق سوبر",
          imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "قطع الفواكه الطازجة مغطاة بطبقة غنية من الكريمة والآيس كريم",
        },
        {
          name: "بارفيه فراولة بالبسكويت",
          price: "60.00",
          category: "حلويات",
          imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "طبقات من الفراولة الطازجة، الكريمة الغنية، والبسكويت المقرمش",
        },
        {
          name: "تشكيلة حلويات فاخرة",
          price: "70.00",
          category: "حلويات",
          imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "تشكيلة من الحلويات الشرقية والغربية الفاخرة المعدة يومياً",
        },
        {
          name: "كيك شوكولاتة بالكريز",
          price: "75.00",
          category: "حلويات",
          imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "كيك شوكولاتة غني بالكريمة الطازجة وحبات الكريز اللذيذة",
        },
        {
          name: "تورتة شوكولاتة غنية",
          price: "80.00",
          category: "حلويات",
          imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "تورتة الشوكولاتة الفاخرة المغطاة بجناش الشوكولاتة البلجيكية",
        },
        {
          name: "تشكيلة عصائر طبيعية",
          price: "30.00",
          category: "عصائر",
          imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "عصائر طازجة 100٪ بدون سكر مضاف أو مواد حافظة",
        },
        {
          name: "عصير برتقال طازج",
          price: "25.00",
          category: "عصائر",
          imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400",
          isAvailable: true,
          description: "عصير برتقال فريش طبيعي غني بالفيتامينات",
        }
      ];
      await db.insert(products).values(initialProducts);
      result = await db.select().from(products).orderBy(products.id);
    }
    return result;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

export async function getBranches() {
  try {
    let result = await db.select().from(branches).orderBy(branches.id);
    if (result.length === 0) {
      // Seed default branches
      const initialBranches = [
        {
          name: "الفرع الرئيسي - القاهرة",
          address: "شارع التحرير، وسط البلد، القاهرة",
          mapsLink: "https://maps.google.com/?q=Cairo,Egypt",
          phone: "0503600613",
          whatsapp: "201091015366",
        },
        {
          name: "فرع الإسكندرية",
          address: "طريق الكورنيش، الإسكندرية",
          mapsLink: "https://maps.google.com/?q=Alexandria,Egypt",
          phone: "0503600613",
          whatsapp: "201091015366",
        },
        {
          name: "فرع الجيزة",
          address: "شارع الهرم، الجيزة",
          mapsLink: "https://maps.google.com/?q=Giza,Egypt",
          phone: "0503600613",
          whatsapp: "201091015366",
        }
      ];
      await db.insert(branches).values(initialBranches);
      result = await db.select().from(branches).orderBy(branches.id);
    }
    return result;
  } catch (error) {
    console.error("Error getting branches:", error);
    return [];
  }
}
