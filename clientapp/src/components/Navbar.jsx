import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ token, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <Link className="navbar-brand" to="/">
                SpentWise
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                    {!token ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/exchange">Exchange Rates</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/auth">Login / Register</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/transactions">Transactions</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/transfers">Transfers</Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
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
