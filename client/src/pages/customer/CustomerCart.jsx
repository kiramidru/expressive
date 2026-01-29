import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialCart = [
  {
    id: 1,
    name: "Cool Sneakers",
    price: 59.99,
    quantity: 2,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 99.99,
    quantity: 1,
  },
];

export default function CustomerCart() {
  const [cart, setCart] = useState(initialCart);
  const navigate = useNavigate();

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800 flex justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
        <header className="p-4 bg-white">
          <div className="flex items-center mb-4">
            <ChevronLeft
              onClick={() => {
                navigate(-1);
              }}
              size={20}
              className="text-gray-600 mr-2"
            />
            <h2 className="text-lg font-semibold text-center flex-grow">
              Cart
            </h2>
          </div>
          <div className=" justify-between">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-gray-700">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <p className="text-lg font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:underline mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-4 flex flex-col items-end">
              <p className="text-xl font-bold">
                Total: ${totalPrice.toFixed(2)}
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
