import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerHeader from "@components/CustomerHeader";
import { apiFetch, readJson } from "../../api.js";
import { loadCart, saveCart } from "../../cart.js";

export default function CustomerProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const coverImageUrl = product
    ? `https://placehold.co/400x600/2A1934/FFFFFF?text=${encodeURIComponent(product.name)}`
    : "https://placehold.co/400x600/2A1934/FFFFFF?text=Product";
  const categoryNames =
    product?.categories?.map((category) => category.name).join(", ") || "None";

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await apiFetch(`/api/customer/product/${id}`);
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

  function addToCart() {
    const quantity = Number(amount);
    const cart = loadCart();
    const existingItem = cart.find((item) => item.id === product.id);

    const nextCart = existingItem
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
          },
        ];

    saveCart(nextCart);
    setMessage("Added to cart.");
  }

  async function buyNow() {
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const response = await apiFetch("/api/customer/order", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, amount: Number(amount) }),
      });
      await readJson(response);
      navigate("/orders");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="app-screen">
        <CustomerHeader />
        <main className="app-main">
          <p className="page-subtitle">Loading product...</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-screen flex min-h-screen flex-col">
        <CustomerHeader />
        <main className="app-main flex-grow">
          <p className="error-state">{error || "Product not found"}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-screen flex min-h-screen flex-col">
      <CustomerHeader />

      <main className="app-main flex-grow">
        <div className="glass-card grid gap-7 rounded-[2rem] p-4 sm:p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <img
              src={coverImageUrl}
              alt={product.name}
              className="h-full min-h-[22rem] w-full object-cover"
            />
            <span className="status-pill absolute left-4 top-4">Available</span>
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow">Product Detail</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              {product.name}
            </h2>
            <p className="mt-4 text-3xl font-black text-amber-300">
              {product.price} Birr
            </p>
            <p className="page-subtitle mt-5">
              {product.description || "No description provided."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="soft-card rounded-2xl p-4">
                <p className="text-slate-400">Available</p>
                <p className="mt-1 text-2xl font-black text-white">
                  {product.amount}
                </p>
              </div>
              <div className="soft-card rounded-2xl p-4">
                <p className="text-slate-400">Product ID</p>
                <p className="mt-1 text-2xl font-black text-white">#{product.id}</p>
              </div>
              <div className="soft-card rounded-2xl p-4">
                <p className="text-slate-400">Categories</p>
                <p className="mt-1 text-lg font-black text-white">{categoryNames}</p>
              </div>
            </div>

            <label className="field-shell mt-6">
              Quantity
              <input
                className="field-input w-28"
                min="1"
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                value={amount}
              />
            </label>

            {error && <p className="error-state mt-4 text-sm">{error}</p>}
            {message && (
              <p className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                {message}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="primary-button disabled:opacity-60"
                disabled={submitting}
                onClick={buyNow}
                type="button"
              >
                {submitting ? "Ordering..." : "Buy now"}
              </button>
              <button
                className="secondary-button"
                onClick={addToCart}
                type="button"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
