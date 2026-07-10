import { useState, useEffect } from "react";
import CustomerHeader from "@components/CustomerHeader";
import CustomerFooter from "@components/CustomerFooter";

export default function CustomerProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/customer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProfile(data);
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
        <div className="flex flex-col justify-between items-center mb-4">
          <h3 className="text-md font-semibold">My Profile</h3>
          <div className="flex flex-col items-center">
            <img
              src={profile.photoUrl}
              alt={profile.firstName}
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-md">{profile.firstName}</p>
          </div>
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}
