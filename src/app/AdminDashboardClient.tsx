"use client";

import React, { useState } from "react";
import { 
  saveSettingsAction, 
  createProductAction, 
  updateProductAction, 
  deleteProductAction, 
  saveBranchAction, 
  deleteBranchAction 
} from "./actions";
import { 
  Lock, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Store, 
  Settings as SettingsIcon, 
  ShoppingBag, 
  Globe, 
  Save, 
  LogOut,
  RefreshCw,
  Phone,
  MessageSquare
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
  adminPassword?: string;
}

interface AdminDashboardClientProps {
  products: Product[];
  branches: Branch[];
  settings: Settings;
}

export default function AdminDashboardClient({ products, branches, settings }: AdminDashboardClientProps) {
  // Security
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Tabs
  const [activeTab, setActiveTab] = useState<"products" | "settings" | "branches">("products");

  // Notifications
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Editing forms state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "حلويات",
    imageUrl: "",
  });

  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    mapsLink: "",
    phone: "",
    whatsapp: "",
  });

  // Settings form state
  const [storeSettings, setStoreSettings] = useState<Settings>({ ...settings });
  const [newPassword, setNewPassword] = useState("");

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Auth check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.adminPassword) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("عذراً، كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.");
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showNotification("يرجى إدخال اسم المنتج وسعره", "error");
      return;
    }
    setLoading(true);
    const res = await createProductAction({
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      imageUrl: newProduct.imageUrl,
    });
    setLoading(false);
    if (res.success) {
      showNotification("تم إضافة المنتج بنجاح وتحديث المتجر فوراً!");
      setNewProduct({ name: "", description: "", price: "", category: "حلويات", imageUrl: "" });
    } else {
      showNotification("حدث خطأ أثناء الإضافة: " + res.error, "error");
    }
  };

  // Update Product handler
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);
    const res = await updateProductAction({
      id: editingProduct.id,
      name: editingProduct.name,
      description: editingProduct.description || "",
      price: editingProduct.price,
      category: editingProduct.category,
      imageUrl: editingProduct.imageUrl,
      isAvailable: editingProduct.isAvailable,
    });
    setLoading(false);
    if (res.success) {
      showNotification("تم تعديل المنتج وتحديث المتجر تلقائياً!");
      setEditingProduct(null);
    } else {
      showNotification("حدث خطأ أثناء التعديل: " + res.error, "error");
    }
  };

  // Delete Product handler
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟")) return;
    setLoading(true);
    const res = await deleteProductAction(id);
    setLoading(false);
    if (res.success) {
      showNotification("تم حذف المنتج بنجاح وتحديث المتجر!");
    } else {
      showNotification("حدث خطأ أثناء الحذف: " + res.error, "error");
    }
  };

  // Settings Save handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveSettingsAction({
      id: storeSettings.id,
      brandName: storeSettings.brandName,
      whatsapp: storeSettings.whatsapp,
      phone: storeSettings.phone,
      facebook: storeSettings.facebook,
      tiktok: storeSettings.tiktok,
      aboutUs: storeSettings.aboutUs,
      heroTitle: storeSettings.heroTitle,
      heroSubtitle: storeSettings.heroSubtitle,
      adminPassword: newPassword,
    });
    setLoading(false);
    if (res.success) {
      showNotification("تم حفظ وتحديث إعدادات الهوية والتواصل بنجاح!");
      if (newPassword) {
        settings.adminPassword = newPassword;
        setNewPassword("");
      }
    } else {
      showNotification("حدث خطأ أثناء حفظ الإعدادات: " + res.error, "error");
    }
  };

  // Save Branch (Create / Update) handler
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = editingBranch 
      ? { ...editingBranch }
      : { ...newBranch };
    const res = await saveBranchAction(payload);
    setLoading(false);
    if (res.success) {
      showNotification(editingBranch ? "تم تعديل بيانات الفرع بنجاح!" : "تم إضافة الفرع الجديد بنجاح!");
      setEditingBranch(null);
      setNewBranch({ name: "", address: "", mapsLink: "", phone: "", whatsapp: "" });
    } else {
      showNotification("حدث خطأ أثناء حفظ الفرع: " + res.error, "error");
    }
  };

  // Delete Branch handler
  const handleDeleteBranch = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفرع نهائياً؟")) return;
    setLoading(true);
    const res = await deleteBranchAction(id);
    setLoading(false);
    if (res.success) {
      showNotification("تم حذف الفرع بنجاح من قائمة الخرائط والتواصل!");
    } else {
      showNotification("حدث خطأ أثناء حذف الفرع: " + res.error, "error");
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4 font-sans" dir="rtl">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#0E4FB3] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-white">لوحة تحكم صابح الآمنة</h2>
            <p className="text-sm text-slate-400">لوحة التحكم الكاملة بالمنتجات، الفروع، وبيانات التواصل</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">أدخل كلمة مرور المسؤول للدخول</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="كلمة المرور الافتراضية: sabih123"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-center focus:outline-none focus:border-[#0E4FB3] transition-colors"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 text-center font-semibold bg-red-950/40 p-2 rounded-lg border border-red-900/50">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#0E4FB3] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-lg transition-all"
            >
              تسجيل الدخول الآمن
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500">
            🔒 محمي بجدار أمان كامل. لا يمكن للعملاء الوصول لهذه الصفحة إطلاقاً.
          </p>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="min-h-screen bg-[#F2F9FF] text-slate-800 flex flex-col font-sans" dir="rtl">
      
      {/* DASHBOARD NAVBAR */}
      <header className="bg-slate-900 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0E4FB3] rounded-xl flex items-center justify-center text-white font-black text-lg">
              ص
            </div>
            <div>
              <h1 className="text-xl font-black">لوحة التحكم الشاملة - {settings.brandName}</h1>
              <p className="text-xs text-slate-400">تحكم كامل وتحديث تلقائي وفوري للمتجر</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              عرض المتجر 🌐
            </a>
          </div>
        </div>
      </header>

      {/* NOTIFICATION TOAST */}
      {message && (
        <div className="fixed top-4 left-4 z-50 animate-bounce">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm text-white flex items-center gap-2 ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
            <Check className="w-5 h-5 stroke-[3]" />
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* DASHBOARD CONTAINER */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        
        {/* TABS SELECTOR */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => { setActiveTab("products"); setEditingProduct(null); }}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "products"
                ? "bg-[#0E4FB3] text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>التحكم بالمنتجات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "settings"
                ? "bg-[#0E4FB3] text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>بيانات التواصل والهوية</span>
          </button>

          <button
            onClick={() => { setActiveTab("branches"); setEditingBranch(null); }}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shrink-0 transition-all ${
              activeTab === "branches"
                ? "bg-[#0E4FB3] text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>الفروع والمواقع الجغرافية ({branches.length})</span>
          </button>
        </div>

        {/* LOADING INDICATOR overlay */}
        {loading && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#0E4FB3]" />
              <span className="font-bold">جاري تحديث البيانات تلقائياً...</span>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PRODUCTS MANAGER */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Create or Edit Product Form */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-lg font-black text-[#0E4FB3] mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                {editingProduct ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                <span>{editingProduct ? `تعديل منتج: ${editingProduct.name}` : "إضافة منتج جديد"}</span>
              </h3>

              {editingProduct ? (
                // UPDATE PRODUCT FORM
                <form onSubmit={handleUpdateProduct} className="space-y-4 text-sm font-semibold">
                  <div>
                    <label className="block text-slate-700 mb-1">اسم المنتج</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 mb-1">السعر (ج.م)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">القسم / التصنيف</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                      >
                        <option value="حلويات">حلويات</option>
                        <option value="أطباق سوبر">أطباق سوبر</option>
                        <option value="عصائر">عصائر</option>
                        <option value="ألبان">ألبان</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">وصف المنتج تفصيلياً</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">رابط صورة المنتج (URL)</label>
                    <input
                      type="text"
                      value={editingProduct.imageUrl}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    />
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={editingProduct.isAvailable}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                      className="w-4 h-4 text-[#0E4FB3] focus:ring-0"
                    />
                    <label htmlFor="isAvailable" className="text-slate-700">المنتج متوفر ومتاح في المتجر حالياً</label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#0E4FB3] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-md transition-colors text-center"
                    >
                      حفظ التعديلات
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : (
                // CREATE PRODUCT FORM
                <form onSubmit={handleCreateProduct} className="space-y-4 text-sm font-semibold">
                  <div>
                    <label className="block text-slate-700 mb-1">اسم المنتج</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: بارفيه فراولة بالبسكويت"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 mb-1">السعر (ج.م)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="60"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">القسم / التصنيف</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                      >
                        <option value="حلويات">حلويات</option>
                        <option value="أطباق سوبر">أطباق سوبر</option>
                        <option value="عصائر">عصائر</option>
                        <option value="ألبان">ألبان</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">وصف المنتج</label>
                    <textarea
                      rows={3}
                      placeholder="صف مكونات ولذة المنتج لتجذب العملاء للشراء..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">رابط صورة المنتج (مباشر)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0E4FB3] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>إضافة منتج وتحديث المتجر</span>
                  </button>
                </form>
              )}
            </div>

            {/* Products List Grid */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span>كل المنتجات المضافة في صابح</span>
                  <span className="text-xs bg-blue-100 text-[#0E4FB3] px-2.5 py-1 rounded-full">{products.length} منتج</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                        <th className="py-3 px-4 font-black">المنتج</th>
                        <th className="py-3 px-4 font-black">القسم</th>
                        <th className="py-3 px-4 font-black">السعر</th>
                        <th className="py-3 px-4 font-black">الحالة</th>
                        <th className="py-3 px-4 font-black text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover border"
                              />
                              <div>
                                <p className="font-extrabold text-slate-800">{p.name}</p>
                                <p className="text-slate-400 text-xs truncate max-w-xs">{p.description || "لا يوجد وصف"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 text-xs bg-[#F2F9FF] text-[#0E4FB3] rounded-full font-bold">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {p.price} ج.م
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              p.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {p.isAvailable ? "متوفر" : "غير متاح"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 bg-blue-50 text-[#0E4FB3] hover:bg-[#0E4FB3] hover:text-white rounded-lg transition-all"
                                title="تعديل المنتج"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB CONTENT: STORE SETTINGS & CONTACT INFO */}
        {activeTab === "settings" && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-3xl mx-auto">
            <h3 className="text-xl font-black text-[#0E4FB3] mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <SettingsIcon className="w-6 h-6" />
              <span>تعديل هوية صابح وأرقام التواصل الاجتماعي</span>
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-sm font-semibold">
              
              {/* Brand Name & Socials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">اسم البراند / العلامة التجارية</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.brandName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, brandName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">رقم الواتساب الرئيسي لتلقي الطلبات (مع كود الدولة)</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.whatsapp}
                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">رقم الهاتف الأرضي</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">رابط صفحة الفيسبوك</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.facebook}
                    onChange={(e) => setStoreSettings({ ...storeSettings, facebook: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">رابط صفحة تيك توك</label>
                <input
                  type="text"
                  required
                  value={storeSettings.tiktok}
                  onChange={(e) => setStoreSettings({ ...storeSettings, tiktok: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                />
              </div>

              {/* Banner / Hero control */}
              <div className="p-4 bg-[#F2F9FF] rounded-2xl border border-[#0E4FB3]/10 space-y-4">
                <h4 className="text-xs font-black text-[#0E4FB3] uppercase tracking-wider">التحكم بنص بنر الترحيب الرئيسي للموقع</h4>
                <div>
                  <label className="block text-slate-700 mb-1">العنوان الرئيسي للبنر</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.heroTitle}
                    onChange={(e) => setStoreSettings({ ...storeSettings, heroTitle: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">العنوان الفرعي للبنر</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.heroSubtitle}
                    onChange={(e) => setStoreSettings({ ...storeSettings, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
              </div>

              {/* About us text */}
              <div>
                <label className="block text-slate-700 mb-1">فقرة من نحن (About Us)</label>
                <textarea
                  rows={4}
                  required
                  value={storeSettings.aboutUs}
                  onChange={(e) => setStoreSettings({ ...storeSettings, aboutUs: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                ></textarea>
              </div>

              {/* Password change security */}
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-2">
                <label className="block text-red-800 font-extrabold mb-1">🔒 تغيير كلمة مرور لوحة التحكم (اختياري)</label>
                <input
                  type="text"
                  placeholder="اتركها فارغة إذا كنت لا ترغب بتغييرها"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-red-200 focus:outline-none focus:border-red-500"
                />
                <p className="text-[10px] text-red-600">احرص على حفظ كلمة المرور الجديدة جيداً للتمكن من الدخول مرة أخرى.</p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#0E4FB3] to-[#22B3FF] text-white font-extrabold rounded-2xl shadow-lg hover:opacity-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>حفظ وتحديث كل إعدادات الهوية والتواصل</span>
              </button>

            </form>
          </div>
        )}

        {/* TAB CONTENT: BRANCHES MANAGEMENT */}
        {activeTab === "branches" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Create/Edit Branch Form */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-lg font-black text-[#0E4FB3] mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                {editingBranch ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                <span>{editingBranch ? `تعديل فرع: ${editingBranch.name}` : "إضافة فرع جغرافي جديد"}</span>
              </h3>

              <form onSubmit={handleSaveBranch} className="space-y-4 text-sm font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">اسم الفرع</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فرع القاهرة الجديدة"
                    value={editingBranch ? editingBranch.name : newBranch.name}
                    onChange={(e) => {
                      if (editingBranch) setEditingBranch({ ...editingBranch, name: e.target.value });
                      else setNewBranch({ ...newBranch, name: e.target.value });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">العنوان بالتفصيل</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شارع التسعين، بجوار كذا"
                    value={editingBranch ? editingBranch.address : newBranch.address}
                    onChange={(e) => {
                      if (editingBranch) setEditingBranch({ ...editingBranch, address: e.target.value });
                      else setNewBranch({ ...newBranch, address: e.target.value });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">رابط الموقع الجغرافي على خرائط Google Maps</label>
                  <input
                    type="text"
                    required
                    placeholder="https://maps.google.com/?q=..."
                    value={editingBranch ? editingBranch.mapsLink : newBranch.mapsLink}
                    onChange={(e) => {
                      if (editingBranch) setEditingBranch({ ...editingBranch, mapsLink: e.target.value });
                      else setNewBranch({ ...newBranch, mapsLink: e.target.value });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 mb-1">هاتف الفرع</label>
                    <input
                      type="text"
                      required
                      placeholder="0503600613"
                      value={editingBranch ? editingBranch.phone : newBranch.phone}
                      onChange={(e) => {
                        if (editingBranch) setEditingBranch({ ...editingBranch, phone: e.target.value });
                        else setNewBranch({ ...newBranch, phone: e.target.value });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">واتس الفرع</label>
                    <input
                      type="text"
                      required
                      placeholder="201091015366"
                      value={editingBranch ? editingBranch.whatsapp : newBranch.whatsapp}
                      onChange={(e) => {
                        if (editingBranch) setEditingBranch({ ...editingBranch, whatsapp: e.target.value });
                        else setNewBranch({ ...newBranch, whatsapp: e.target.value });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4FB3]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0E4FB3] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-md transition-colors text-center"
                  >
                    حفظ وبيانات الفرع
                  </button>
                  {editingBranch && (
                    <button
                      type="button"
                      onClick={() => setEditingBranch(null)}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List of current branches */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span>كل الفروع الجغرافية المضافة</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{branches.length} فروع</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl border-2 border-[#0E4FB3]/10 bg-[#F2F9FF]/30 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{b.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">📍 {b.address}</p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mt-3 pt-2 border-t border-slate-100">
                          <span>📞 {b.phone}</span>
                          <span>💬 {b.whatsapp}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setEditingBranch(b)}
                          className="flex-1 py-2 bg-blue-50 text-[#0E4FB3] hover:bg-[#0E4FB3] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(b.id)}
                          className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* ADMIN FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs mt-auto">
        جميع التغييرات التي تقوم بها على لوحة التحكم يتم حفظها في قاعدة بيانات Postgres وتنعكس تلقائياً للزوار.
      </footer>

    </div>
  );
}
