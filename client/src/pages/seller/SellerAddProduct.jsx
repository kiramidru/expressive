import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch, readJson } from "../../api.js";

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    brandId: "",
    categoryNames: "",
    amount: "1",
    price: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await apiFetch("/api/seller/brand");
        const data = await readJson(response);
        setBrands(data.data);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    fetchBrands();
  }, []);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function parseCategoryNames(value) {
    const names = new Map();

    for (const categoryName of value.split(",")) {
      const name = categoryName.trim();
      if (name) {
        names.set(name.toLowerCase(), name);
      }
    }

    return [...names.values()];
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const categoryNames = parseCategoryNames(form.categoryNames);

    const payload = {
      name: form.name,
      description: form.description || undefined,
      brandId: form.brandId ? Number(form.brandId) : undefined,
      categoryNames: categoryNames.length > 0 ? categoryNames : undefined,
      amount: Number(form.amount),
      price: Number(form.price),
    };

    try {
      const response = await apiFetch("/api/seller/product", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const product = await readJson(response);
      navigate(`/seller/product/${product.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-screen min-h-screen">
      <main className="app-main">
        <form className="glass-card mx-auto max-w-3xl rounded-[2rem] p-5 sm:p-8" onSubmit={submit}>
        <div className="mb-7 flex items-start gap-3">
          <button
            className="icon-button shrink-0"
            onClick={() => navigate(-1)}
            type="button"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="eyebrow">New Listing</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
              Add product
            </h1>
          <p className="page-subtitle mt-3">
            Brand and categories are optional. Create a brand first if you want to attach one.
          </p>
          </div>
        </div>

        <div className="grid gap-4">
        <label className="field-shell">
          Product Name
          <input
            className="field-input"
            name="name"
            onChange={updateField}
            required
            value={form.name}
          />
        </label>

        <label className="field-shell">
          Description
          <textarea
            className="field-input h-28"
            name="description"
            onChange={updateField}
            value={form.description}
          />
        </label>

        <label className="field-shell">
          Brand
          <select
            className="field-input"
            name="brandId"
            onChange={updateField}
            value={form.brandId}
          >
            <option value="">No brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field-shell">
          Category Names
          <input
            className="field-input"
            name="categoryNames"
            onChange={updateField}
            placeholder="Coffee, Pantry, Gifts"
            value={form.categoryNames}
          />
          <span className="mt-2 text-xs font-semibold text-slate-500">
            Separate multiple categories with commas.
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="field-shell">
            Amount
            <input
              className="field-input"
              min="0"
              name="amount"
              onChange={updateField}
              required
              type="number"
              value={form.amount}
            />
          </label>
          <label className="field-shell">
            Price
            <input
              className="field-input"
              min="0"
              name="price"
              onChange={updateField}
              required
              step="0.01"
              type="number"
              value={form.price}
            />
          </label>
        </div>

        {error && <p className="error-state text-sm">{error}</p>}

        <footer className="mt-6 flex justify-end border-t border-white/10 pt-5">
          <button
            className="primary-button w-full sm:w-auto disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Publishing..." : "Publish Product"}
          </button>
        </footer>
        </div>
      </form>
      </main>
    </div>
  );
}
