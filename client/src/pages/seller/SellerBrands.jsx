import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "@components/SellerHeader";
import { apiFetch, readJson } from "../../api.js";

export default function SellerBrands() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await apiFetch("/api/seller/brand");
        const data = await readJson(response);
        setBrands(data.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="app-screen">
        <SellerHeader />
        <main className="app-main">
          <p className="page-subtitle">Loading brands...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-screen flex min-h-screen flex-col">
      <SellerHeader />
      <main className="app-main flex-grow">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Catalog Identity</p>
            <h1 className="page-title mt-3">My brands</h1>
            <p className="page-subtitle mt-4 max-w-2xl">
              Organize listings under recognizable seller-owned brands.
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() => navigate("/seller/add-brand")}
            type="button"
          >
            Add Brand
          </button>
        </div>

        {error && <p className="error-state mb-4 text-sm">{error}</p>}

        {brands.length === 0 ? (
          <p className="empty-state">
            You have not created any brands yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <article
                key={brand.id}
                className="soft-card overflow-hidden rounded-[1.5rem] p-3"
              >
                <div className="relative overflow-hidden rounded-[1.15rem]">
                  <img
                    src={
                      brand.logoUrl ||
                      `https://placehold.co/400x600/2A1934/FFFFFF?text=${encodeURIComponent(brand.name)}`
                    }
                    alt={brand.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="p-2 pt-4">
                <h4 className="text-lg font-black text-white">{brand.name}</h4>
                <p className="mt-2 text-sm text-slate-400">
                  {brand.description || "No description provided."}
                </p>
                {brand.websiteUrl && (
                  <a
                    className="mt-3 inline-flex text-sm font-bold text-amber-300"
                    href={brand.websiteUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Website
                  </a>
                )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
