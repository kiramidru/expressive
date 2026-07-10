import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SellerAddProduct() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: "Food",
    },
    {
      id: 2,
      title: "Electronics",
    },
    {
      id: 1,
      title: "Clothing",
    },
    {
      id: 1,
      title: "Healthcare",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center w-full bg-white  shadow-xl sticky top-0 z-99">
        <ChevronLeft
          onClick={() => {
            navigate(-1);
          }}
          size={24}
          className="text-gray-600"
        />
        <h2 className="text-gray-600">Add Product</h2>
        <div />
      </header>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Enter necessary information</h3>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Product Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
          <label htmlFor="name" className="block text-sm font-medium">
            Product Description:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
          <label htmlFor="name" className="block text-sm font-medium">
            Product Image:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
          <div>
            <h3 className="block text-sm font-medium mb-1">Category</h3>
            <input
              type="text"
              id="category_search"
              name="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Search"
            />
            <div className="space-y-2 max-h-24 overflow-y-auto mt-4">
              {categories.map((category) => (
                <div className="flex items-center space-x-2">
                  <input
                    id={category.id}
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor={category.id} className="text-gray-700">
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full flex justify-between items-center bg-white border-t border-gray-200 sticky bottom-0 p-4">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="w-full bg-teal-500 p-3 text-white rounded-lg"
        >
          <p> Publish Product</p>
        </button>
      </footer>
    </div>
  );
}
