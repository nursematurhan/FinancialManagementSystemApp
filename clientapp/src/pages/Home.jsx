import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4 mb-4">💼 Welcome to the Financial Management App</h1>
            <p className="lead mb-5">
                Track your expenses, manage transfers, and stay in control of your money.
            </p>

            <div className="d-flex justify-content-center gap-3 mb-5">
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-outline-primary">Register</Link>
            </div>

            <div className="text-muted">
                <h5>🔍 Key Features</h5>
                <ul className="list-unstyled">
                    <li>✅ Personal Expense Tracking</li>
                    <li>✅ Secure Money Transfers</li>
                    <li>✅ Profile Management</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;
