import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SellerAddBrand() {
  const navigate = useNavigate();

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
        <h2 className="text-gray-600">Add Brand</h2>
        <div />
      </header>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Enter necessary information</h3>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Brand Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
          <label htmlFor="name" className="block text-sm font-medium">
            Brand Description:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
          <label htmlFor="name" className="block text-sm font-medium">
            Brand Image:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
          <label htmlFor="name" className="block text-sm font-medium">
            Brand URL:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder=""
          />
        </div>
      </div>
      <footer className="w-full flex justify-between items-center bg-white border-t border-gray-200 sticky bottom-0 p-4">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="w-full bg-teal-500 p-3 text-white rounded-lg"
        >
          <p> Publish Brand</p>
        </button>
      </footer>
    </div>
  );
}
