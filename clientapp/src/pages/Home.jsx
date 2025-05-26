import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container mt-5 text-center ">
            <h1 className="display-4 fw-bold mb-4">💼</h1>
            <p className="lead text-muted mb-5">
                Your personal assistant for tracking expenses, managing transfers, and making smarter financial decisions.
            </p>

            <div className="d-flex justify-content-center gap-3 mb-4">
                <Link to="/auth" className="btn btn-primary btn-lg px-4">Get Started</Link>
                <Link to="/exchange" className="btn btn-outline-secondary btn-lg px-4">Check Exchange Rates</Link>
            </div>

            <hr className="my-5" />

            <div className="row text-start">
                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">📊 Expense Tracking</h5>
                            <p className="card-text">
                                Log and categorize your spending effortlessly. Visualize your habits to stay on budget.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">💸 Money Transfers</h5>
                            <p className="card-text">
                                Send and receive money between users securely. Share your User ID and go!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">🛡️ Secure Profile</h5>
                            <p className="card-text">
                                Update your personal details anytime. Your data is safe with us — always encrypted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default Home;
