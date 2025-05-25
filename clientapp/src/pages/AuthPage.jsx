import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthPage = ({ onLogin }) => {
    const [showLogin, setShowLogin] = useState(true);

    const handleRegisterSuccess = () => {
        setShowLogin(true); 
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                {showLogin ? (
                    <>
                        <Login onLogin={onLogin} />
                        <p className="text-center mt-3">
                            Don't have an account?{" "}
                            <button onClick={() => setShowLogin(false)} className="btn btn-link p-0">
                                Register here
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <Register onRegisterSuccess={handleRegisterSuccess} />
                        <p className="text-center mt-3">
                            Already have an account?{" "}
                            <button onClick={() => setShowLogin(true)} className="btn btn-link p-0">
                                Login here
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
