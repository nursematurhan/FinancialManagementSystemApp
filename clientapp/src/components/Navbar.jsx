import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const Navbar = ({ token, onLogout }) => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout();
        navigate("/auth");
    };

    return (
        <nav className="navbar navbar-expand-lg px-4" style={{ backgroundColor: "#83769c" }}>
            <Link className="navbar-brand fw-bold text-white" to={token ? "/dashboard" : "/"}>
                <img
                    src={logo}
                    alt="SpendWise Logo"
                    style={{ height: "42px", marginRight: "10px" }}
                />
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}>
                <ul className="navbar-nav ms-auto gap-2">
                    {!token ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/exchange">Exchange Rates</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/auth">Login / Register</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/profile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/transactions">Transactions</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/transfers">Transfers</Link>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-dark btn-sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
