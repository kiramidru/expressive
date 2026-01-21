import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.Telegram?.WebApp?.initData) {
      const initData = window.Telegram.WebApp.initData;
      fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("role", data.role);
          setData(data);
          setLoading(false);
        })
        .catch((err) => console.error("Login error:", err));
    }
  }, []);

  useEffect(() => {
    if (!loading && data.role) {
      if (data.role === "CUSTOMER") navigate("/home");
      else if (data.role === "SELLER") navigate("/seller/home");
    }
  }, [loading, data, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Logging in via Telegram...</h1>
        <p>Please wait while we authenticate your account.</p>
      </div>
    );
  }
}
