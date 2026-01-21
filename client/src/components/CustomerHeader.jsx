import { Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="p-4 flex justify-between items-center w-full bg-white  shadow-xl sticky top-0 z-99">
      <Search size={24} className="text-gray-600" />
      <h2 className="text-gray-600">Express Store</h2>
      <ShoppingCart
        onClick={() => navigate("/cart")}
        size={24}
        className="text-gray-600"
      />
    </header>
  );
}
