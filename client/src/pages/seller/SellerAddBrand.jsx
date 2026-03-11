import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch, readJson } from "../../api.js";

export default function SellerAddBrand() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await apiFetch("/api/seller/brand", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          logoUrl: form.logoUrl || undefined,
          websiteUrl: form.websiteUrl || undefined,
        }),
      });
      await readJson(response);
      navigate("/seller/brands");
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
            <p className="eyebrow">Brand Identity</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
              Add brand
            </h1>
            <p className="page-subtitle mt-3">
              Create a seller-owned brand to attach to future listings.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
        <label className="field-shell">
          Brand Name
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
          Logo URL
          <input
            className="field-input"
            name="logoUrl"
            onChange={updateField}
            type="url"
            value={form.logoUrl}
          />
        </label>

        <label className="field-shell">
          Website URL
          <input
            className="field-input"
            name="websiteUrl"
            onChange={updateField}
            type="url"
            value={form.websiteUrl}
          />
        </label>

        {error && <p className="error-state text-sm">{error}</p>}

        <footer className="mt-6 flex justify-end border-t border-white/10 pt-5">
          <button
            className="primary-button w-full sm:w-auto disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Publishing..." : "Publish Brand"}
          </button>
        </footer>
        </div>
      </form>
      </main>
    </div>
  );
}
