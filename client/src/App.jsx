import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

export default function App() {
    const role = localStorage.getItem("role");

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />

                    <Route element={<CustomerRoutes role={role} />}>
                        <Route path="/home" element={<CustomerHome />} />
                        <Route path="/cart" element={<CustomerCart />} />
                        <Route path="/orders" element={<CustomerOrders />} />
                        <Route path="/product/" element={<CustomerProductDetail />} />
                        <Route path="/profile" element={<CustomerProfile />} />
                    </Route>

                    <Route element={<SellerRoutes role={role} />}>
                        <Route path="/seller/home" element={<SellerHome />} />
                        <Route path="/seller/orders" element={<SellerOrders />} />
                        <Route path="/seller/product" element={<SellerProductDetail />} />
                        <Route path="/seller/profile" element={<SellerProfile />} />
                        <Route path="/seller/brands" element={<SellerBrands />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
