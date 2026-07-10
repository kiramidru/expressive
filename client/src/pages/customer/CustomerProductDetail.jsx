import { Heart } from "lucide-react";
import CustomerHeader from "@components/CustomerHeader";
import CustomerFooter from "@components/CustomerFooter";

export default function CustomerProductDetail() {
  const coverImageUrl =
    "https://placehold.co/400x600/2A1934/FFFFFF?text=Book+Cover";

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="p-4 sm:p-6">
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 relative">
            <img
              src={coverImageUrl}
              alt="Book Cover of Bamburgh"
              className="w-full h-auto rounded-lg shadow-md mb-4 md:mb-0 object-cover"
            />
          </div>

          {/* Product Info Section */}
          <div className="md:w-1/2 mt-4 md:mt-0">
            <h2 className="text-2xl sm:text-3xl font-bold">Bamburgh</h2>
            <div className="flex justify-between space-x-2 text-gray-500">
              <span>Book Seller Co.</span>
              <Heart size={20} className="text-gray-400" />
            </div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              FROM THE #1 INTERNATIONAL BESTSELLING AUTHOR OF HOLY ISLAND AND
              IMPOSTOR
            </p>
          </div>
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}
