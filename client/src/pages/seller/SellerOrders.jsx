import { useState, useEffect } from "react";
import SellerHeader from "@components/SellerHeader";
import SellerFooter from "@components/SellerFooter";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/customer/order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setOrders(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <SellerHeader />

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">My Orders</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {orders.map((product) => (
            <div
              onClick={() => handleProductClick(product)}
              key={product.id}
              className="bg-white rounded-lg shadow-lg p-2 flex flex-col"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h4 className="font-semibold text-sm mt-1">{product.title}</h4>
              <p className="text-xs">{product.name}</p>
              <p className="text-xs mt-1">{product.description}</p>
              <div className="mt-auto pt-2">
                <span className="text-sm font-bold block">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SellerFooter />
    </div>
  );
}
