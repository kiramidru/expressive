import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerFooter from "@components/CustomerFooter.jsx";
import CustomerHeader from "@components/CustomerHeader.jsx";

export default function CustomerHome() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const coverImageUrl = "https://placehold.co/400x600/2A1934/FFFFFF?text=";

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/customer/product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Products</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              onClick={() => handleProductClick(product)}
              key={product.id}
              className="bg-white rounded-lg shadow-lg p-2 flex flex-col"
            >
              <div className="relative">
                <img
                  src={`${coverImageUrl}${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h4 className="font-bold text-sm mt-1">{product.name}</h4>
              <p className="text-xs mt-1">{product.description}</p>
              <div className="mt-auto pt-2">
                <span className="text-sm font-bold block">
                  {product.price} Birr
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}
