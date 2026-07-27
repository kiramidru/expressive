import { useEffect, useState } from "react";
import CustomerHeader from "@components/CustomerHeader";
import { apiFetch, readJson } from "../../api.js";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await apiFetch("/api/customer/order");
        const data = await readJson(res);
        setOrders(data.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  async function cancelOrder(id) {
    setError("");

    try {
      const response = await apiFetch("/api/customer/order", {
        method: "PATCH",
        body: JSON.stringify({ id, status: "CANCELLED" }),
      });
      const updatedOrder = await readJson(response);
      setOrders((current) =>
        current.map((order) => (order.id === id ? updatedOrder : order)),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) {
    return (
      <div className="app-screen">
        <CustomerHeader />
        <main className="app-main">
          <p className="page-subtitle">Loading orders...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-screen flex min-h-screen flex-col">
      <CustomerHeader />

      <main className="app-main flex-grow">
        <section className="mb-6">
          <p className="eyebrow">Purchases</p>
          <h1 className="page-title mt-3">My orders</h1>
          <p className="page-subtitle mt-4 max-w-2xl">
            Track your purchases and cancel pending orders when needed.
          </p>
        </section>
        {error && <p className="error-state mb-4 text-sm">{error}</p>}
        {orders.length === 0 ? (
          <p className="empty-state">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="soft-card rounded-[1.35rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-white">Order #{order.id}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Product #{order.productId} · Quantity {order.amount}
                    </p>
                    <p className="text-sm text-slate-400">
                      Price: {order.priceAtPurchase} Birr
                    </p>
                  </div>
                  <span className="status-pill">
                    {order.status}
                  </span>
                </div>
                {order.status !== "CANCELLED" && (
                  <button
                    className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm font-bold text-red-200"
                    onClick={() => cancelOrder(order.id)}
                    type="button"
                  >
                    Cancel order
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
