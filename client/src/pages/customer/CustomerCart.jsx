import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch, readJson } from "../../api.js";
import { loadCart, saveCart } from "../../cart.js";

export default function CustomerCart() {
  const [cart, setCart] = useState(loadCart);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  function updateCart(nextCart) {
    setCart(nextCart);
    saveCart(nextCart);
  }

  function updateQuantity(id, change) {
    updateCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  }

  function removeItem(id) {
    updateCart(cart.filter((item) => item.id !== id));
  }

  async function checkout() {
    setError("");
    setCheckingOut(true);

    try {
      for (const item of cart) {
        const response = await apiFetch("/api/customer/order", {
          method: "POST",
          body: JSON.stringify({ productId: item.id, amount: item.quantity }),
        });
        await readJson(response);
      }

      updateCart([]);
      navigate("/orders");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCheckingOut(false);
    }
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="app-screen min-h-screen">
      <main className="app-main">
        <section className="glass-card mx-auto max-w-2xl rounded-[2rem] p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <ChevronLeft
              onClick={() => navigate(-1)}
              size={20}
              className="text-slate-300"
            />
            <div>
              <p className="eyebrow">Checkout</p>
              <h1 className="text-3xl font-black tracking-tight text-white">Cart</h1>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="empty-state text-center">
              <p className="text-sm">Your cart is empty.</p>
              <button
                className="primary-button mt-4"
                onClick={() => navigate("/home")}
                type="button"
              >
                Browse products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="soft-card flex items-center justify-between gap-4 rounded-[1.25rem] p-4"
                >
                  <div>
                    <h2 className="text-lg font-black text-white">{item.name}</h2>
                    <p className="text-slate-400">{item.price} Birr</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="rounded-lg bg-slate-800 px-3 py-1 text-white hover:bg-slate-700"
                        type="button"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="rounded-lg bg-slate-800 px-3 py-1 text-white hover:bg-slate-700"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <p className="text-lg font-black text-amber-300">
                      {(item.price * item.quantity).toFixed(2)} Birr
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-2 text-sm font-bold text-red-300 hover:underline"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="error-state mt-4 text-sm">{error}</p>}

          {cart.length > 0 && (
            <div className="mt-8 flex flex-col items-end border-t border-white/10 pt-5">
              <p className="text-xl font-black text-white">
                Total: {totalPrice.toFixed(2)} Birr
              </p>
              <button
                onClick={checkout}
                className="primary-button mt-4 disabled:opacity-60"
                disabled={checkingOut}
                type="button"
              >
                {checkingOut ? "Creating orders..." : "Checkout"}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
