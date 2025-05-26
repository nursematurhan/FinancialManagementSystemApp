import React, { useEffect, useState } from "react";
import ExpenseChart from "../components/ExpenseChart";
import {
    getProfile,
    getMyTransfers,
    getReceivedTransfers,
    getTransactions,
    getBalance,
} from "../services/api";

const Dashboard = () => {
    const [profile, setProfile] = useState({});
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [sentTransfers, setSentTransfers] = useState([]);
    const [receivedTransfers, setReceivedTransfers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, balanceRes, transRes, sentRes, receivedRes] = await Promise.all([
                    getProfile(),
                    getBalance(),
                    getTransactions(),
                    getMyTransfers(),
                    getReceivedTransfers(),
                ]);

                setProfile(profileRes.data);
                setBalance(balanceRes.data.balance);
                setTransactions(
                    transRes.data
                        .filter(t => !t.category?.toLowerCase().includes("transfer"))
                        .slice(-5)
                        .reverse()
                );
                setSentTransfers(sentRes.data.slice(-5).reverse());
                setReceivedTransfers(receivedRes.data.slice(-5).reverse());
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow mb-4">
                <h2 className="text-center">Welcome, {profile.fullName}</h2>
                <p className="text-center">
                    <strong>User ID:</strong> <code>{profile.id}</code><br />
                    <strong>Balance:</strong> {balance} ₺
                </p>
            </div>

            <div className="row">
                {/* Recent Expenses */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Recent Expenses</h5>
                            <ul className="list-group list-group-flush">
                                {transactions.map((t, i) => (
                                    <li className="list-group-item text-danger" key={i}>
                                        - {t.amount} ₺ - {t.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Sent Transfers */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Sent Transfers</h5>
                            <ul className="list-group list-group-flush">
                                {sentTransfers.map((t, i) => (
                                    <li className="list-group-item" key={i}>
                                        To: {t.recipient?.fullName || t.recipient?.id || "Unknown"} - {t.amount} ₺
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Received Transfers */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Received Transfers</h5>
                            <ul className="list-group list-group-flush">
                                {receivedTransfers.map((t, i) => (
                                    <li className="list-group-item text-success" key={i}>
                                        From: {t.sender?.fullName || t.sender?.id || "Unknown"} - {t.amount} ₺
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Category Chart */}
            {/*<ExpenseChart transactions={transactions} />*/}
        </div>
         
    );
};

export default Dashboard;
