import React, { useEffect, useState } from "react";
import {
    getMyTransfers,
    addTransfer,
    updateTransfer,
    deleteTransfer
} from "../services/api";

const timeOptions = [
    { label: "All Time", value: "" },
    { label: "Last 12 Hours", value: "12h" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 365 Days", value: "365d" },
];

const Transfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [recipientId, setRecipientId] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [timeRange, setTimeRange] = useState("");

    
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
        setSuccessMessage("");

        const transferData = {
            recipientId,
            amount: parseFloat(amount),
            note,
        };

        try {
            if (editId) {
                await updateTransfer(editId, transferData);
                setSuccessMessage("Transfer updated successfully!");
                setEditId(null);
            } else {
                await addTransfer(transferData);
                setSuccessMessage("Transfer completed successfully!");
            }

            setRecipientId("");
            setAmount("");
            setNote("");
            fetchTransfers();

            setTimeout(() => setSuccessMessage(""), 3000);
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

    const filteredTransfers = transfers.filter(t => {
        const matchesSearch =
            !searchTerm ||
            (t.recipient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.recipientId?.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesTime = true;
        if (timeRange) {
            const now = new Date();
            const transferDate = new Date(t.date);
            let compareDate = new Date();

            if (timeRange.endsWith("h")) {
                const hours = parseInt(timeRange);
                compareDate.setHours(now.getHours() - hours);
            } else if (timeRange.endsWith("d")) {
                const days = parseInt(timeRange);
                compareDate.setDate(now.getDate() - days);
            }

            matchesTime = transferDate >= compareDate;
        }

        return matchesSearch && matchesTime;
    });


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

                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>

            <div className="d-flex gap-3 mb-4">
                <select
                    className="form-select w-auto"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    {timeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by recipient name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
            </div>


            <ul className="list-group">
                {filteredTransfers.length === 0 ? (
                    <li className="list-group-item text-muted">No transfers found.</li>
                ) : (
                    filteredTransfers.map((t) => (
                        <li
                            key={t.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{t.amount} ₺</strong> → {t.recipient?.fullName || t.recipientId}
                                {t.note && <div className="text-muted">Note: {t.note}</div>}
                                <div className="text-muted small">
                                    {new Date(t.date).toLocaleString("en-GB", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
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
                    ))
                )}
            </ul>

        </div>
    );
};

export default Transfers;
