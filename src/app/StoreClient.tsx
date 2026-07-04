"use client";

import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  ShoppingCart, 
  Phone, 
  MapPin, 
  Check, 
  MessageSquare, 
  Search, 
  X, 
  Plus, 
  Minus, 
  ArrowLeft,
  Heart,
  ExternalLink,
  ChevronDown
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  mapsLink: string;
  phone: string;
  whatsapp: string;
}

interface Settings {
  id: number;
  brandName: string;
  whatsapp: string;
  phone: string;
  facebook: string;
  tiktok: string;
  aboutUs: string;
  heroTitle: string;
  heroSubtitle: string;
}

interface StoreClientProps {
  products: Product[];
  branches: Branch[];
  settings: Settings;
}

export default function StoreClient({ products, branches, settings }: StoreClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Quick contact form states
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Extract unique categories dynamically from actual database products, adding "الكل"
  const categories = useMemo(() => {
    const list = ["الكل"];
    products.forEach((p) => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === "الكل" || p.category === selectedCategory;
      const matchSearch = trimmedQuery === "" || p.name.toLowerCase().includes(trimmedQuery) || (p.description && p.description.toLowerCase().includes(trimmedQuery));
      return matchCategory && matchSearch && p.isAvailable;
    });
  }, [products, selectedCategory, trimmedQuery]);

  // Add to cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Open cart sidebar on addition
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Total price
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  }, [cart]);

  // Total quantity
  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Direct single-product order WhatsApp Link generator
  const getSingleOrderUrl = (product: Product) => {
    const message = `أهلاً متجر ${settings.brandName}، أرغب في طلب:\n- *${product.name}* (الكمية: 1) بسعر *${product.price} ج.م*.\n\nشكراً لكم!`;
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Multi-item Cart Order WhatsApp Link generator
  const getCartOrderUrl = () => {
    let message = `أهلاً متجر ${settings.brandName}، أرغب في تأكيد الطلب التالي:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}* - الكمية: (${item.quantity}) - السعر الفردي: ${item.product.price} ج.م\n`;
    });
    message += `\n💵 *إجمالي الحساب:* ${totalPrice.toFixed(2)} ج.م\n`;
    message += `\nالرجاء تأكيد الطلب والتوصيل في أقرب وقت. شكراً!`;
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Direct Form submission to WhatsApp
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      alert("من فضلك أدخل الاسم ورقم الهاتف لإرسال طلبك");
      return;
    }
    const message = `أهلاً، أنا العميل ${contactName}\nرقم الهاتف: ${contactPhone}\n\nالرسالة:\n${contactMessage || "أرغب في الاستفسار والتواصل معكم!"}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F2F9FF] text-slate-800 flex flex-col font-sans selection:bg-[#0E4FB3] selection:text-white" dir="rtl">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#0E4FB3]/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#0E4FB3] to-[#22B3FF] rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-md transform hover:rotate-12 transition-transform">
              ص
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0E4FB3] tracking-wider leading-none">{settings.brandName}</h1>
              <p className="text-xs text-[#22B3FF] font-semibold mt-1">منتجات ألبان وحلويات فاخرة</p>
            </div>
          </div>

          {/* Quick Nav Links for smooth scroll */}
          <nav className="hidden md:flex items-center gap-6 font-bold text-slate-700">
            <a href="#hero" className="hover:text-[#0E4FB3] transition-colors">الرئيسية</a>
            <a href="#products" className="hover:text-[#0E4FB3] transition-colors">المنتجات</a>
            <a href="#about" className="hover:text-[#0E4FB3] transition-colors">من نحن</a>
            <a href="#contact" className="hover:text-[#0E4FB3] transition-colors">تواصل معنا</a>
            <a href="#branches" className="hover:text-[#0E4FB3] transition-colors">فروعنا</a>
          </nav>

          {/* Search bar & Cart Trigger */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-48 md:w-64">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery === " " ? "" : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-4 py-1.5 rounded-full text-sm border border-slate-200 focus:outline-none focus:border-[#0E4FB3] focus:ring-1 focus:ring-[#0E4FB3] transition-all"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-gradient-to-r from-[#0E4FB3] to-[#22B3FF] hover:opacity-95 text-white rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              title="سلة المشتريات"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalQuantity}
                </span>
              )}
              <span className="hidden md:inline text-xs font-bold px-1">سلة الطلبات</span>
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE SEARCH BAR */}
      <div className="sm:hidden px-4 py-2 bg-white border-b border-slate-100">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن منتج بالاسم أو الوصف..."
            value={searchQuery === " " ? "" : searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-full text-sm bg-[#F2F9FF] border-none focus:outline-none focus:ring-2 focus:ring-[#0E4FB3]"
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-[#0E4FB3]" />
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#0E4FB3] via-[#105ad4] to-[#F2F9FF] text-white py-16 md:py-24">
        {/* Background elements to match first screenshot banner design */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#22B3FF]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col (Arabic layout: text goes right side, images go left. But text first in source) */}
            <div className="lg:col-span-7 text-center lg:text-right space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold tracking-wide backdrop-blur-sm shadow-inner">
                🚀 توصيل سريع لجميع المناطق
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-md">
                {settings.heroTitle}
              </h2>
              <p className="text-lg md:text-xl text-blue-100 font-medium max-w-2xl leading-relaxed">
                {settings.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#products"
                  className="px-8 py-3.5 bg-white text-[#0E4FB3] hover:bg-slate-100 font-extrabold rounded-full shadow-xl transition-all hover:-translate-y-0.5"
                >
                  تصفح المنتجات الآن
                </a>
                <a
                  href="#contact"
                  className="px-8 py-3.5 bg-[#22B3FF] hover:bg-[#22B3FF]/90 text-white font-extrabold rounded-full shadow-lg transition-all border border-white/20"
                >
                  تواصل معنا
                </a>
              </div>
            </div>

            {/* Right Col: circular hero image frame from screen 1 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                {/* Outermost rotating gradient border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#22B3FF] via-white to-[#0E4FB3] p-1.5 animate-spin-slow shadow-2xl">
                  <div className="w-full h-full bg-[#0E4FB3] rounded-full"></div>
                </div>

                {/* Inner Content Image Frame */}
                <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white shadow-inner bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600"
                    alt={settings.brandName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badges popping out */}
                <div className="absolute -top-3 -right-3 bg-white text-[#0E4FB3] p-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold animate-bounce text-sm">
                  <Check className="w-5 h-5 text-green-500 stroke-[3]" />
                  <span>طبيعي 100٪</span>
                </div>

                <div className="absolute -bottom-3 -left-3 bg-white text-[#0E4FB3] p-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-sm">
                  <span>طلب سهل عبر الواتساب</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK GUARANTEES BANNER (Screen 1 section with 4 boxes) */}
      <section className="relative -mt-6 z-20 max-w-5xl mx-auto w-full px-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border border-slate-100">
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-1">
              🚚
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">توصيل سريع</h4>
            <p className="text-xs text-slate-500">لكل مكان متاح</p>
          </div>

          <div className="flex flex-col items-center gap-2 border-r border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mb-1">
              ✅
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">جودة مضمونة</h4>
            <p className="text-xs text-slate-500">طازجة وصحية %100</p>
          </div>

          <div className="flex flex-col items-center gap-2 border-r border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600 mb-1">
              💳
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">الدفع عند الاستلام</h4>
            <p className="text-xs text-slate-500">أو التحويل المباشر</p>
          </div>

          <div className="flex flex-col items-center gap-2 border-r border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
              💬
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">طلب سهل عبر واتس</h4>
            <p className="text-xs text-slate-500">بضغطة واحدة مباشرة</p>
          </div>

        </div>
      </section>

      {/* PRODUCTS DISPLAY SECTION */}
      <section id="products" className="py-16 container mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <h3 className="text-3xl md:text-4xl font-black text-[#0E4FB3] relative inline-block">
            تصفح منتجاتنا
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#22B3FF] rounded-full"></span>
          </h3>
          <p className="text-slate-500 font-medium">
            اختر القسم اللي يعجبك وشوف أحلى المنتجات واطلبها مباشرة
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform active:scale-95 ${
                selectedCategory === cat
                  ? "bg-[#0E4FB3] text-white shadow-lg scale-105"
                  : "bg-white text-[#0E4FB3] hover:bg-[#F2F9FF] border border-[#0E4FB3]/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID WITH EXACT CUSTOM PRODUCT BORDER & BRAND COLORS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-lg mx-auto">
            <p className="text-lg font-bold text-slate-400">لا يوجد منتجات في هذا القسم حالياً</p>
            <p className="text-sm text-slate-400 mt-1">تفضل بتغيير القسم أو البحث عن اسم آخر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-[32px] p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-white flex flex-col justify-between"
                style={{
                  boxShadow: "0 15px 40px -15px rgba(14, 79, 179, 0.12)"
                }}
              >
                
                {/* Rounded blobs decoration at corners to replicate Screen 2 design */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#22B3FF]/15 rounded-br-[60px] -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#22B3FF]/10 rounded-tl-[60px] -z-10 group-hover:scale-110 transition-transform"></div>

                {/* Top Corner Badge for Category */}
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3.5 py-1 text-[11px] font-extrabold text-[#0E4FB3] bg-[#F2F9FF] rounded-full uppercase tracking-wider border border-[#0E4FB3]/10">
                    {product.category}
                  </span>
                  <button className="text-slate-300 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Product Circle Image Frame with backdrop blobs (Exact match screen 2 style) */}
                <div className="relative mx-auto mb-6 flex justify-center items-center">
                  
                  {/* Backdrop Blob shape behind product */}
                  <div className="absolute w-44 h-44 bg-gradient-to-tr from-[#0E4FB3]/10 to-[#22B3FF]/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform"></div>
                  
                  {/* Main circular image container */}
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-[6px] border-white shadow-lg bg-slate-50 z-10">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-center space-y-2 z-10 flex-grow">
                  <h4 className="text-xl font-extrabold text-[#0E4FB3] group-hover:text-blue-700 transition-colors leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                    {product.description || "أشهى المكونات الطازجة المحضرة يومياً بكل حب خصيصاً لك."}
                  </p>
                </div>

                {/* BOTTOM PRICE TAG BAR (Styled as Screen 2 exact custom layout) */}
                <div className="mt-6 flex flex-col gap-3 z-10">
                  <div className="flex items-center justify-between bg-[#F2F9FF] p-2 rounded-2xl border border-[#0E4FB3]/10">
                    <span className="text-xs font-bold text-slate-500 mr-2">السعر</span>
                    <span className="text-lg font-black text-[#0E4FB3] bg-white px-3 py-1 rounded-xl shadow-sm">
                      {product.price} <span className="text-xs font-semibold">ج.م</span>
                    </span>
                  </div>

                  {/* Order Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="py-2.5 px-3 bg-[#F2F9FF] hover:bg-[#0E4FB3] hover:text-white text-[#0E4FB3] font-bold text-xs rounded-xl border border-[#0E4FB3]/10 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>للسلة</span>
                    </button>

                    {/* Direct WhatsApp Order */}
                    <a
                      href={getSingleOrderUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-gradient-to-l from-[#0E4FB3] to-[#22B3FF] hover:opacity-90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>اطلب الآن</span>
                    </a>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#F2F9FF] text-[#0E4FB3] rounded-3xl flex items-center justify-center mx-auto shadow-md">
            <span className="text-3xl">🥛</span>
          </div>
          <h3 className="text-3xl font-black text-[#0E4FB3]">من نحن</h3>
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            {settings.aboutUs}
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-6">
            <div className="bg-[#F2F9FF] p-4 rounded-2xl border border-[#0E4FB3]/5">
              <p className="text-2xl font-black text-[#0E4FB3]">100%</p>
              <p className="text-xs text-slate-500 font-bold">طبيعي وطازج</p>
            </div>
            <div className="bg-[#F2F9FF] p-4 rounded-2xl border border-[#0E4FB3]/5">
              <p className="text-2xl font-black text-[#0E4FB3]">+15</p>
              <p className="text-xs text-slate-500 font-bold">صنف مميز</p>
            </div>
            <div className="bg-[#F2F9FF] p-4 rounded-2xl border border-[#0E4FB3]/5">
              <p className="text-2xl font-black text-[#0E4FB3]">24/7</p>
              <p className="text-xs text-slate-500 font-bold">خدمة واستقبال</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-16 bg-[#F2F9FF]">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <h3 className="text-3xl font-black text-[#0E4FB3]">تواصل معنا</h3>
            <p className="text-slate-500 font-medium">إحنا هنا عشان نساعدك، تواصل معنا بأي طريقة تناسبك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-extrabold text-[#0E4FB3] mb-6">ابعتلنا رسالة (عبر واتساب)</h4>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">الاسم بالكامل</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="مثال: أحمد محمد"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="مثال: 010xxxxxxxx"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3] text-sm text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">اكتب رسالتك هنا...</label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="اكتب طلبك أو استفسارك بالتفصيل..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3] text-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#0E4FB3] to-[#22B3FF] text-white font-extrabold rounded-2xl shadow-lg hover:opacity-95 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>إرسال عبر واتساب 💬</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0E4FB3] to-[#1a66e0] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="space-y-6">
                <h4 className="text-xl font-extrabold">بيانات التواصل</h4>
                
                <div className="space-y-4 text-sm">
                  
                  {/* Landline */}
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                    <Phone className="w-5 h-5 text-[#22B3FF] shrink-0" />
                    <div>
                      <p className="text-xs text-blue-200">الرقم الأرضي</p>
                      <p className="font-bold text-base">{settings.phone}</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                    <span className="text-xl shrink-0">💬</span>
                    <div>
                      <p className="text-xs text-blue-200">الواتس آب (مباشر)</p>
                      <p className="font-bold text-base" dir="ltr">+{settings.whatsapp}</p>
                    </div>
                  </div>

                  {/* Social media links */}
                  <div className="flex items-center gap-4 pt-4">
                    <a
                      href={settings.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-[#0E4FB3] rounded-full flex items-center justify-center transition-all shadow-md"
                      title="فيسبوك"
                    >
                      <span className="font-bold text-lg">f</span>
                    </a>
                    <a
                      href={settings.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all shadow-md"
                      title="تيك توك"
                    >
                      <span className="font-extrabold text-sm">🎵</span>
                    </a>
                  </div>

                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 text-xs text-blue-100 font-medium">
                🕒 نحن نعمل على مدار 24 ساعة لخدمتكم وتلبية طلباتكم بأفضل جودة.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* BRANCHES GEOLOCATIONS SECTION */}
      <section id="branches" className="py-16 container mx-auto px-4">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <h3 className="text-3xl font-black text-[#0E4FB3]">فروعنا</h3>
          <p className="text-slate-500 font-medium">زورنا في أقرب فرع ليك أو اطلب نوصلك لحد الباب</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 hover:border-[#0E4FB3]/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#F2F9FF] text-[#0E4FB3] rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-800">{branch.name}</h4>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <span>📍</span> {branch.address}
                  </p>
                </div>
              </div>

              {/* Fake Interactive Map Box styled beautifully like the screenshot map display */}
              <div className="my-4 h-32 bg-slate-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-200">
                <div className="absolute inset-0 bg-[radial-gradient(#0E4FB3_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <span className="absolute bottom-2 right-2 bg-white/95 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  خريطة الموقع الجغرافي
                </span>
                <span className="text-2xl">🗺️</span>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${branch.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <span>واتساب</span>
                  </a>
                  <a
                    href={`tel:${branch.phone}`}
                    className="flex-1 py-2 px-3 bg-[#0E4FB3] hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Phone className="w-3 h-3" />
                    <span>اتصال</span>
                  </a>
                </div>
                
                <a
                  href={branch.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all text-center"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>الاتجاهات على الخريطة</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#0E4FB3] text-white py-12 mt-auto border-t-4 border-[#22B3FF]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            <div className="space-y-3">
              <h4 className="text-xl font-extrabold">{settings.brandName}</h4>
              <p className="text-sm text-blue-100">
                متجرك المفضل لأجود المنتجات الطازجة والحلويات الفاخرة. اطلب بسهولة عبر واتساب لتأكيد طلبك وتوصيله فوراً.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold">روابط سريعة</h4>
              <ul className="text-sm space-y-2 text-blue-100">
                <li><a href="#hero" className="hover:underline">الرئيسية</a></li>
                <li><a href="#products" className="hover:underline">المنتجات</a></li>
                <li><a href="#about" className="hover:underline">من نحن</a></li>
                <li><a href="#contact" className="hover:underline">تواصل معنا</a></li>
                <li><a href="#branches" className="hover:underline">فروعنا</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold">تواصل معنا</h4>
              <p className="text-sm text-blue-100">📞 الهاتف الأرضي: {settings.phone}</p>
              <p className="text-sm text-blue-100">💬 رقم الواتساب الرئيسي: +{settings.whatsapp}</p>
              <p className="text-sm text-blue-100">📍 جميع الفروع متاحة على الخريطة</p>
            </div>

          </div>

          <div className="border-t border-white/10 pt-6 text-center text-xs text-blue-200">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ {settings.brandName}.
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP CHAT BUTTON */}
      <a
        href={`https://wa.me/${settings.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce"
        title="تواصل مباشر عبر واتساب"
      >
        <span className="text-2xl">💬</span>
      </a>

      {/* CART SIDEBAR MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Background overlay */}
            <div 
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            ></div>

            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-white shadow-2xl rounded-r-3xl border-r border-[#0E4FB3]/10">
                  
                  {/* Cart Header */}
                  <div className="px-6 py-5 bg-gradient-to-l from-[#0E4FB3] to-[#22B3FF] text-white flex items-center justify-between rounded-tr-3xl">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      <h2 className="text-lg font-black" id="slide-over-title">سلة طلباتك</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="rounded-full p-1 bg-white/20 hover:bg-white/30 text-white transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Cart Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <span className="text-5xl">🛒</span>
                        <div>
                          <p className="text-lg font-bold text-slate-800">السلة فارغة حالياً</p>
                          <p className="text-xs text-slate-400 mt-1">تصفح منتجات صابح وأضف ما تشتهيه هنا لطلب مجمع وموفر!</p>
                        </div>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="px-6 py-2.5 bg-[#0E4FB3] text-white font-bold text-xs rounded-full shadow-md"
                        >
                          تصفح المنتجات
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center gap-4 bg-[#F2F9FF] p-3 rounded-2xl border border-[#0E4FB3]/5 relative group"
                          >
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                            />
                            
                            <div className="flex-grow">
                              <h4 className="text-sm font-black text-[#0E4FB3]">{item.product.name}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{item.product.price} ج.م</p>
                              
                              {/* Quantity controls */}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  className="w-6 h-6 bg-white hover:bg-[#0E4FB3] hover:text-white rounded-md flex items-center justify-center text-[#0E4FB3] border border-slate-200 transition-all"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-slate-800">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                  className="w-6 h-6 bg-white hover:bg-[#0E4FB3] hover:text-white rounded-md flex items-center justify-center text-[#0E4FB3] border border-slate-200 transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="text-left">
                              <p className="text-xs font-black text-slate-800">{(parseFloat(item.product.price) * item.quantity).toFixed(2)} ج.م</p>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-400 hover:text-red-600 text-[10px] mt-2 underline block"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="border-t border-slate-100 px-6 py-6 bg-slate-50 rounded-b-3xl">
                      <div className="flex justify-between text-base font-bold text-slate-900 mb-4">
                        <span>إجمالي الحساب:</span>
                        <span className="text-[#0E4FB3] text-xl font-black">{totalPrice.toFixed(2)} ج.م</span>
                      </div>
                      
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        ⚠️ عند الضغط على زر التأكيد، سيتم توجيهك مباشرة لتطبيق الواتساب مع رسالة تفصيلية تحتوي على جميع المنتجات المطلوبة وحسابها الإجمالي لإتمام طلبك بسرعة.
                      </p>

                      <div className="space-y-2">
                        <a
                          href={getCartOrderUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 bg-gradient-to-r from-[#0E4FB3] to-[#22B3FF] hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg transition-all text-center flex items-center justify-center gap-2"
                        >
                          <span>إرسال الطلب عبر واتساب 💬</span>
                        </a>
                        <button
                          onClick={() => setCart([])}
                          className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
                        >
                          تفريغ السلة بالكامل
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
