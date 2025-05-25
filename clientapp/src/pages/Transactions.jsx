import React, { useEffect, useState } from "react";
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} from "../services/api";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await getTransactions();
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load transactions.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const newTransaction = {
            amount: parseFloat(amount),
            description,
        };

        try {
            if (editId) {
                await updateTransaction(editId, newTransaction);
                setEditId(null);
            } else {
                await addTransaction(newTransaction);
            }

            setAmount("");
            setDescription("");
            fetchTransactions();
        } catch (err) {
            console.error(err);
            setError("Failed to save transaction.");
        }
    };

    const handleEdit = (transaction) => {
        setEditId(transaction.id);
        setAmount(transaction.amount);
        setDescription(transaction.description);
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
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {editId ? "Update Transaction" : "Add Transaction"}
                </button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>

            <ul className="list-group">
                {transactions.map((t) => (
                    <li
                        key={t.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{t.amount} ₺</strong> - {t.description}
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(t)}
                                className="btn btn-sm btn-warning me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(t.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Transactions;
