import { CircleUser, Home, LogOut, Package, Plus, Trello } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuth } from "../api.js";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    function active(path) {
        return location.pathname === path ? " active" : "";
    }

    function logout() {
        clearAuth();
        navigate("/login", { replace: true });
    }

    return (
        <header className="app-topbar">
            <div className="app-topbar-inner">
                <div className="brand-lockup">
                    <div className="brand-mark">E</div>
                    <div>
                        <p className="eyebrow">Seller Studio</p>
                        <h2 className="text-sm font-black tracking-tight text-white">
                            Express Store
                        </h2>
                    </div>
                </div>
                <nav className="flex items-center gap-2">
                    <button
                        className={`top-nav-action${active("/seller/home")}`}
                        onClick={() => navigate("/seller/home")}
                        type="button"
                        aria-label="Home"
                    >
                        <Home size={18} />
                    </button>
                    <button
                        className={`top-nav-action${active("/seller/orders")}`}
                        onClick={() => navigate("/seller/orders")}
                        type="button"
                        aria-label="Orders"
                    >
                        <Package size={18} />
                    </button>
                    <button
                        className="top-nav-action featured"
                        onClick={() => navigate("/seller/add-product")}
                        type="button"
                        aria-label="Add product"
                    >
                        <Plus size={18} />
                    </button>
                    <button
                        className={`top-nav-action${active("/seller/brands")}`}
                        onClick={() => navigate("/seller/brands")}
                        type="button"
                        aria-label="Brands"
                    >
                        <Trello size={18} />
                    </button>
                    <button
                        className={`top-nav-action${active("/seller/profile")}`}
                        onClick={() => navigate("/seller/profile")}
                        type="button"
                        aria-label="Profile"
                    >
                        <CircleUser size={18} />
                    </button>
                    <button
                        className="top-nav-action"
                        onClick={logout}
                        type="button"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </nav>
            </div>
        </header>
    );
}
