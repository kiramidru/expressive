import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { API_URL, clearAuth, getToken } from "./api.js";
import Login from "@pages/Login.jsx";
import CustomerRoutes from "@routes/CustomerRoutes.jsx";
import CustomerHome from "@pages/customer/CustomerHome.jsx";
import CustomerOrders from "@pages/customer/CustomerOrders.jsx";
import CustomerCart from "@pages/customer/CustomerCart.jsx";
import CustomerProductDetail from "@pages/customer/CustomerProductDetail.jsx";
import CustomerProfile from "@pages/customer/CustomerProfile.jsx";
import SellerRoutes from "@routes/SellerRoutes.jsx";
import SellerHome from "@pages/seller/SellerHome.jsx";
import SellerOrders from "@pages/seller/SellerOrders";
import SellerBrands from "@pages/seller/SellerBrands.jsx";
import SellerProductDetail from "@pages/seller/SellerProductDetail";
import SellerProfile from "@pages/seller/SellerProfile";
import SellerAddProduct from "@pages/seller/SellerAddProduct.jsx";
import SellerAddBrand from "@pages/seller/SellerAddBrand.jsx";

export default function App() {
    const [role, setRole] = useState(() => localStorage.getItem("role"));
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        function syncRole() {
            setRole(localStorage.getItem("role"));
        }

        window.addEventListener("auth-change", syncRole);
        return () => window.removeEventListener("auth-change", syncRole);
    }, []);

    useEffect(() => {
        async function validateToken() {
            const token = getToken();
            if (!token) {
                setAuthReady(true);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    clearAuth();
                    setAuthReady(true);
                    return;
                }

                const profile = await response.json();
                if (!["CUSTOMER", "SELLER"].includes(profile.role)) {
                    clearAuth();
                    setAuthReady(true);
                    return;
                }

                localStorage.setItem("role", profile.role);
                setRole(profile.role);
            } catch {
                clearAuth();
            } finally {
                setAuthReady(true);
            }
        }

        validateToken();
    }, []);

    const login = <Login onAuthenticated={setRole} />;
    const landingPage =
        role === "CUSTOMER" ? (
            <Navigate to="/home" replace />
        ) : role === "SELLER" ? (
            <Navigate to="/seller/home" replace />
        ) : (
            login
        );

    if (!authReady) {
        return <p className="mt-10 text-center">Loading...</p>;
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={landingPage} />
                    <Route path="/login" element={login} />

                    <Route element={<CustomerRoutes role={role} />}>
                        <Route path="/home" element={<CustomerHome />} />
                        <Route path="/cart" element={<CustomerCart />} />
                        <Route path="/orders" element={<CustomerOrders />} />
                        <Route path="/product/:id" element={<CustomerProductDetail />} />
                        <Route path="/profile" element={<CustomerProfile />} />
                    </Route>

                    <Route element={<SellerRoutes role={role} />}>
                        <Route path="/seller/home" element={<SellerHome />} />
                        <Route path="/seller/orders" element={<SellerOrders />} />
                        <Route path="/seller/product/:id" element={<SellerProductDetail />} />
                        <Route path="/seller/profile" element={<SellerProfile />} />
                        <Route path="/seller/brands" element={<SellerBrands />} />
                        <Route path="/seller/add-product" element={<SellerAddProduct />} />
                        <Route path="/seller/add-brand" element={<SellerAddBrand />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
