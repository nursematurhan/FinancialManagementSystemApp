// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ token, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout(); // App.jsx içindeki setToken'i tetikler
        navigate("/login");
    };

    return (
        <nav style={{ padding: "10px", background: "#f5f5f5", display: "flex", gap: "15px" }}>
            {!token && <Link to="/">Home</Link>}
            {!token ? (
                <>
                    <Link to="/exchange">Exchange Rates</Link>
                    <Link to="/auth">Login / Register</Link>


                </>
            ) : (
                <>
                    <Link to="/profile">Profile</Link>
                    <Link to="/transactions">Transactions</Link>
                    <Link to="/transfers">Transfers</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
