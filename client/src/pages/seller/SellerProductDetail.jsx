import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SellerHeader from "@components/SellerHeader";
import { apiFetch, readJson } from "../../api.js";

export default function SellerProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const coverImageUrl = product
    ? `https://placehold.co/400x600/2A1934/FFFFFF?text=${encodeURIComponent(product.name)}`
    : "https://placehold.co/400x600/2A1934/FFFFFF?text=Product";
  const categoryNames =
    product?.categories?.map((category) => category.name).join(", ") || "None";

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await apiFetch(`/api/seller/product/${id}`);
        const data = await readJson(response);
        setProduct(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="app-screen">
        <SellerHeader />
        <main className="app-main">
          <p className="page-subtitle">Loading product...</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-screen flex min-h-screen flex-col">
        <SellerHeader />
        <main className="app-main flex-grow">
          <p className="error-state">{error || "Product not found"}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-screen flex min-h-screen flex-col">
      <SellerHeader />

      <main className="app-main flex-grow">
        <div className="glass-card grid gap-7 rounded-[2rem] p-4 sm:p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <img
              src={coverImageUrl}
              alt={product.name}
              className="h-full min-h-[22rem] w-full object-cover"
            />
            <span className="status-pill absolute left-4 top-4">Listing</span>
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow">Seller Listing</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              {product.name}
            </h2>
            <p className="mt-4 text-3xl font-black text-amber-300">
              {product.price} Birr
            </p>
            <p className="page-subtitle mt-5">
              {product.description || "No description provided."}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="soft-card rounded-2xl p-4">
                <dt className="text-slate-400">Inventory</dt>
                <dd className="mt-1 text-2xl font-black text-white">{product.amount}</dd>
              </div>
              <div className="soft-card rounded-2xl p-4">
                <dt className="text-slate-400">Brand ID</dt>
                <dd className="mt-1 text-2xl font-black text-white">
                  {product.brandId || "None"}
                </dd>
              </div>
              <div className="soft-card rounded-2xl p-4">
                <dt className="text-slate-400">Categories</dt>
                <dd className="mt-1 text-lg font-black text-white">
                  {categoryNames}
                </dd>
              </div>
              <div className="soft-card rounded-2xl p-4">
                <dt className="text-slate-400">Product ID</dt>
                <dd className="mt-1 text-2xl font-black text-white">#{product.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
