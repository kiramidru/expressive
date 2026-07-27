import { useEffect, useState } from "react";
import SellerHeader from "@components/SellerHeader";
import { apiFetch, readJson } from "../../api.js";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await apiFetch("/api/seller/order");
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

  async function updateStatus(id, status) {
    setError("");

    try {
      const response = await apiFetch("/api/seller/order", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
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
        <SellerHeader />
        <main className="app-main">
          <p className="page-subtitle">Loading orders...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-screen flex min-h-screen flex-col">
      <SellerHeader />

      <main className="app-main flex-grow">
        <section className="mb-6">
          <p className="eyebrow">Fulfillment</p>
          <h1 className="page-title mt-3">Seller orders</h1>
          <p className="page-subtitle mt-4 max-w-2xl">
            Review product orders and update their fulfillment status.
          </p>
        </section>
        {error && <p className="error-state mb-4 text-sm">{error}</p>}
        {orders.length === 0 ? (
          <p className="empty-state">
            No orders have been placed for your products yet.
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
                  <select
                    className="field-input max-w-[10rem] text-sm"
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                    value={order.status}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
