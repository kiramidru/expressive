import { CircleUser, Home, Package, Plus, Trello } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="w-full flex justify-between items-center bg-white border-t border-gray-200 sticky bottom-0">
      <button
        onClick={() => {
          navigate("/home");
        }}
        className="p-4"
      >
        <Home size={24} />
      </button>
      <button
        onClick={() => {
          navigate("/seller/orders");
        }}
        className="p-4"
      >
        <Package size={24} />
      </button>
      <button
        onClick={() => {
          navigate("/seller/add-product");
        }}
        className="p-2 bg-black m-2 rounded-lg text-white"
      >
        <Plus size={24} />
      </button>
      <button
        onClick={() => {
          navigate("/seller/brands");
        }}
        className="p-4"
      >
        <Trello size={24} />
      </button>
      <button
        onClick={() => {
          navigate("/seller/profile");
        }}
        className="p-4"
      >
        <CircleUser size={24} />
      </button>
    </footer>
  );
}
