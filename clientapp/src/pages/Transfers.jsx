import React, { useEffect, useState } from "react";
import {
    getMyTransfers,
    addTransfer,
    updateTransfer,
    deleteTransfer
} from "../services/api";

const Transfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [recipientId, setRecipientId] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const res = await getMyTransfers(); 
            setTransfers(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load transfers.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const transferData = {
            recipientId, // ⚠️ recipient değil!
            amount: parseFloat(amount),
            note,
        };

        try {
            if (editId) {
                await updateTransfer(editId, transferData);
                setEditId(null);
            } else {
                await addTransfer(transferData);
            }

            setRecipientId("");
            setAmount("");
            setNote("");
            fetchTransfers();
        } catch (err) {
            console.error(err);
            setError("Failed to save transfer.");
        }
    };

    const handleEdit = (transfer) => {
        setEditId(transfer.id);
        setRecipientId(transfer.recipientId);
        setAmount(transfer.amount);
        setNote(transfer.note || "");
    };

    const handleDelete = async (id) => {
        try {
            await deleteTransfer(id);
            fetchTransfers();
        } catch (err) {
            console.error(err);
            setError("Failed to delete transfer.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Transfers</h2>

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Recipient User ID"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        required
                    />
                </div>
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
                        placeholder="Note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {editId ? "Update Transfer" : "Send Transfer"}
                </button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>

            <ul className="list-group">
                {transfers.map((t) => (
                    <li
                        key={t.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{t.amount} ₺</strong> →{" "}
                            {t.recipient?.fullName || t.recipientId}
                            {t.note && <div className="text-muted">Note: {t.note}</div>}
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(t)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(t.id)}
                                className="btn btn-danger btn-sm"
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

export default Transfers;
