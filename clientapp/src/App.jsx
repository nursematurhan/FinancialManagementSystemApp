import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import Transfers from "./pages/Transfers";
import AuthPage from "./pages/AuthPage";
import ExchangeRates from "./pages/ExchangeRates";

const Home = () => (
    <div className="container mt-5">
        <h1 className="text-center">Welcome to the Financial Management App</h1>
        <p className="text-center">Track your expenses, manage transfers, and stay in control.</p>
    </div>
);

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Sayfa yüklenince token'ý kontrol et
    useEffect(() => {
        setToken(localStorage.getItem("token"));

        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Login ve Logout iþlemleri
    const handleLogin = () => {
        setToken(localStorage.getItem("token"));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <Router>
            <Navbar token={token} onLogout={handleLogout} />
            <Routes>
                {/* Giriþ yapýlmamýþsa ana sayfaya, yapýlmýþsa profile yönlendir */}
                <Route path="/" element={!token ? <Home /> : <Navigate to="/profile" />} />
                <Route
                    path="/auth"
                    element={!token ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/profile" />}
                />
                <Route path="/exchange" element={<ExchangeRates />} />

                {/* Korumalý rotalar */}
                {token ? (
                    <>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/transfers" element={<Transfers />} />
                    </>
                ) : (
                    <>
                        <Route path="/profile" element={<Navigate to="/auth" />} />
                        <Route path="/transactions" element={<Navigate to="/auth" />} />
                        <Route path="/transfers" element={<Navigate to="/auth" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
