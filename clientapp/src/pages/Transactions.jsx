import React, { useEffect, useState } from "react";
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} from "../services/api";

const categoryOptions = [
    "Food", "Transport", "Shopping", "Bills",
    "Entertainment", "Health", "Other",
];

const timeOptions = [
    { label: "All Time", value: "" },
    { label: "Last 12 Hours", value: "12h" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 365 Days", value: "365d" },
];

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [timeRange, setTimeRange] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await getTransactions();
            const parsed = res.data.map(t => ({
                ...t,
                date: new Date(t.date),
            }));
            setTransactions(parsed);
        } catch (err) {
            console.error(err);
            setError("Failed to load transactions.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const newTransaction = {
            amount: parseFloat(amount),
            description,
            category,
        };

        try {
            if (editId) {
                await updateTransaction(editId, newTransaction);
                setSuccessMessage("Transaction updated successfully!");
                setEditId(null);
            } else {
                await addTransaction(newTransaction);
                setSuccessMessage("Transaction added successfully!");
            }

            setAmount("");
            setDescription("");
            setCategory("");
            fetchTransactions();

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to save transaction.");
        }
    };

    const handleEdit = (transaction) => {
        setEditId(transaction.id);
        setAmount(transaction.amount);
        setDescription(transaction.description);
        setCategory(transaction.category || "Other");
    };

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            fetchTransactions();
        } catch (err) {
            console.error(err);
            setError("Failed to delete transaction.");
        }
    };

    const allCategories = [...new Set(transactions.map(t => t.category))];

    const filteredTransactions = transactions.filter((t) => {
        const matchCategory = !filterCategory || t.category === filterCategory;

        let matchTime = true;
        if (timeRange) {
            const now = new Date();
            let compareDate = new Date();

            if (timeRange.endsWith("h")) {
                const hours = parseInt(timeRange);
                compareDate.setHours(now.getHours() - hours);
            } else if (timeRange.endsWith("d")) {
                const days = parseInt(timeRange);
                compareDate.setDate(now.getDate() - days);
            }

            matchTime = t.date >= compareDate;
        }

        return matchCategory && matchTime;
    });

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Transactions</h2>

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {editId ? "Update Transaction" : "Add Transaction"}
                </button>

                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>

            {/* Filters */}
            <div className="d-flex gap-3 flex-wrap mb-4">
                <select
                    className="form-select w-auto"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    className="form-select w-auto"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    {timeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <ul className="list-group">
                {filteredTransactions.length === 0 ? (
                    <li className="list-group-item text-muted">No matching transactions found.</li>
                ) : (
                    filteredTransactions.map(t => (
                        <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{t.amount} ₺</strong> - {t.description}
                                <span className="badge bg-secondary ms-2">{t.category}</span>
                            </div>
                            <div>
                                {!t.category?.startsWith("Transfer") && (
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="btn btn-sm btn-warning me-2"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="btn btn-sm btn-danger"
                                >
                                    Delete
                                </button>
                            </div>

                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Transactions;
