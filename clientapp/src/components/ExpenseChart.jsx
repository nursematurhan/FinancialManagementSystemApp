// components/ExpenseChart.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ transactions }) => {
    const categoryMap = {};

    // Yalnýzca "Transaction" kategorili harcamalarý filtrele
    const filteredTransactions = transactions.filter(tx => tx.category === "Transaction");

    filteredTransactions.forEach(tx => {
        const subCategory = tx.subCategory || "Other"; // Alt kategori varsa onunla grupla
        categoryMap[subCategory] = (categoryMap[subCategory] || 0) + tx.amount;
    });

    const data = {
        labels: Object.keys(categoryMap),
        datasets: [
            {
                label: "Transaction Expenses by Category",
                data: Object.values(categoryMap),
                backgroundColor: [
                    "#ff6384", "#36a2eb", "#ffce56",
                    "#4bc0c0", "#9966ff", "#ff9f40",
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartStyle = {
        width: "100%",
        maxWidth: "400px",
        height: "250px",
        margin: "0 auto"
    };

    return (
        <div className="card shadow-sm p-3 mt-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <h5 className="text-center mb-3">Transaction Expenses by Category</h5>
            {Object.keys(categoryMap).length > 0 ? (
                <div style={chartStyle}>
                    <Doughnut data={data} options={{ maintainAspectRatio: false }} />
                </div>
            ) : (
                <p className="text-center text-muted">No transaction data to display.</p>
            )}
        </div>
    );
};

export default ExpenseChart;
