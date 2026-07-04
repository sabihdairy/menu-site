import { getProducts, getBranches, getSettings } from "@/db/queries";
import AdminDashboardClient from "../AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const settings = await getSettings();
  const products = await getProducts();
  const branches = await getBranches();

  return (
    <AdminDashboardClient 
      products={products}
      branches={branches}
      settings={settings}
    />
  );
}
