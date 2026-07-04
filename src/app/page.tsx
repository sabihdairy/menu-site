import { getProducts, getBranches, getSettings } from "@/db/queries";
import StoreClient from "./StoreClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();
  const products = await getProducts();
  const branches = await getBranches();

  return (
    <StoreClient 
      products={products}
      branches={branches}
      settings={settings}
    />
  );
}
