import React, { useState } from "react";
import { getExchangeRate } from "../services/api";

const ExchangeRates = () => {
    const [currency, setCurrency] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const fetchData = async (code) => {
        const upperCode = code.trim().toUpperCase();
        if (!upperCode) return;

        try {
            setError("");
            const res = await getExchangeRate(upperCode);
            setData(res.data);
            setCurrency(upperCode);
        } catch (err) {
            console.error(err);
            setError("Currency not found or API error.");
            setData(null);
        }
    };

    const handleInput = (e) => setCurrency(e.target.value);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") fetchData(currency);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Exchange Rate Lookup</h2>

                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter currency code (e.g., USD, EUR)"
                                value={currency}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => fetchData(currency)}
                                disabled={!currency.trim()}
                            >
                                Get Rate
                            </button>
                        </div>

                        <div className="d-flex justify-content-center gap-2 mb-3">
                            {["USD", "EUR", "GBP"].map((cur) => (
                                <button
                                    key={cur}
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => fetchData(cur)}
                                >
                                    {cur}
                                </button>
                            ))}
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        {data && (
                            <div className="card p-3 mt-3">
                                <p><strong>Currency:</strong> {data.currency}</p>
                                <p><strong>Forex Buying:</strong> {data.forexBuying}</p>
                                <p><strong>Forex Selling:</strong> {data.forexSelling}</p>
                                <p><strong>Banknote Buying:</strong> {data.banknoteBuying}</p>
                                <p><strong>Banknote Selling:</strong> {data.banknoteSelling}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExchangeRates;
