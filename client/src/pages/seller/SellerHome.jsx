import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "@components/SellerHeader";
import { apiFetch, readJson } from "../../api.js";

export default function SellerHome() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const coverImageUrl = "https://placehold.co/400x600/2A1934/FFFFFF?text=";

  const handleProductClick = (product) => {
    navigate(`/seller/product/${product.id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch("/api/seller/product");
        const data = await readJson(res);
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="app-screen">
        <SellerHeader />
        <main className="app-main">
          <p className="page-subtitle">Loading your products...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-screen flex min-h-screen flex-col">
      <SellerHeader />

      <main className="app-main flex-grow">
        <section className="glass-card mb-6 rounded-[2rem] p-6 sm:p-8">
          <p className="eyebrow">Seller Studio</p>
          <div className="mt-4 grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <h1 className="page-title">Manage your storefront.</h1>
              <p className="page-subtitle mt-4 max-w-xl">
                Track inventory, review listings, and publish new products from
                one focused seller workspace.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-teal-300 p-5 text-slate-950">
              <p className="text-sm font-bold uppercase tracking-widest">
                Active listings
              </p>
              <p className="mt-2 text-4xl font-black">{products.length}</p>
              <p className="text-sm font-semibold text-slate-700">products</p>
            </div>
          </div>
        </section>

        {error && <p className="error-state mb-4 text-sm">{error}</p>}
        {products.length === 0 ? (
          <p className="empty-state">You have not published any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <button
              onClick={() => handleProductClick(product)}
              key={product.id}
              className="soft-card group overflow-hidden rounded-[1.5rem] p-3 text-left transition hover:-translate-y-1 hover:border-amber-300/45"
              type="button"
            >
              <div className="relative overflow-hidden rounded-[1.15rem]">
                <img
                  src={`${coverImageUrl}${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="status-pill absolute left-3 top-3">
                  Qty {product.amount}
                </span>
              </div>
              <div className="p-2 pt-4">
                <h4 className="text-lg font-black tracking-tight text-white">
                  {product.name}
                </h4>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {product.description || "No description provided."}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  {product.categories?.map((category) => category.name).join(" / ") ||
                    "Uncategorized"}
                </p>
                <span className="mt-4 block text-xl font-black text-amber-300">
                  {product.price} Birr
                </span>
              </div>
            </button>
          ))}
          </div>
        )}
      </main>
    </div>
  );
}
