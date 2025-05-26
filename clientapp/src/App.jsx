import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import Transfers from "./pages/Transfers";
import AuthPage from "./pages/AuthPage";
import ExchangeRates from "./pages/ExchangeRates";
import Dashboard from "./pages/Dashboard"; 
import Home from "./pages/Home";


function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));


    useEffect(() => {
        setToken(localStorage.getItem("token"));

        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);


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
               
                <Route path="/" element={!token ? <Home /> : <Navigate to="/dashboard" />} />
                <Route
                    path="/auth"
                    element={!token ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
                />
                <Route path="/exchange" element={<ExchangeRates />} />

               
                {token ? (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/transfers" element={<Transfers />} />
                    </>
                ) : (
                    <>
                        <Route path="/dashboard" element={<Navigate to="/auth" />} />
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
