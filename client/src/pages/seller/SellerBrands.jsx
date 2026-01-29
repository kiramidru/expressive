import { useNavigate } from "react-router-dom";
import SellerHeader from "@components/SellerHeader";
import SellerFooter from "@components/SellerFooter";

export default function SellerBrands() {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const brands = [
    {
      id: 1,
      title: "Bamburgh",
      description: "A DCI Ryan Mystery...",
      image: "https://placehold.co/400x600/2A1934/FFFFFF?text=Bamburgh",
    },
    {
      id: 2,
      title: "Bamburgh",
      description: "A DCI Ryan Mystery...",
      image: "https://placehold.co/400x600/2A1934/FFFFFF?text=Bamburgh",
    },
    {
      id: 3,
      title: "Bamburgh",
      description: "A DCI Ryan Mystery...",
      image: "https://placehold.co/400x600/2A1934/FFFFFF?text=Bamburgh",
    },
    {
      id: 4,
      title: "Bamburgh",
      description: "A DCI Ryan Mystery...",
      image: "https://placehold.co/400x600/2A1934/FFFFFF?text=Bamburgh",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SellerHeader />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">My Brands</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {brands.map((brand) => (
            <div
              onClick={() => handleProductClick(product)}
              key={brand.id}
              className="bg-white rounded-lg shadow-lg p-2 flex flex-col"
            >
              <div className="relative">
                <img
                  src={brand.image}
                  alt={brand.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h4 className="font-semibold text-sm mt-1">{brand.title}</h4>
              <p className="text-xs mt-1">{brand.description}</p>
            </div>
          ))}
        </div>
      </div>
      <SellerFooter />
    </div>
  );
}
