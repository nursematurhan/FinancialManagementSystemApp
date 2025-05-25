import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5138/api/Auth/login", {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);

            if (typeof onLogin === "function") {
                onLogin();
            }

            navigate("/profile");
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please check your credentials.");
        }
    };


    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="col-md-6 col-lg-5">
                <div className="card p-4 shadow">
                    <h3 className="text-center mb-4">Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Login
                        </button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
