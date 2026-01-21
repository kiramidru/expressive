import { Search, ShoppingCart } from "lucide-react";

export default function Header() {
    return (
        <header className="p-4 flex justify-between items-center w-full bg-white  shadow-xl sticky top-0 z-99">
            <Search size={24} className="text-gray-600" />
            <h2 className="text-gray-600">Express Store</h2>
            <ShoppingCart size={24} className="text-gray-600" />
        </header>
    );
}
