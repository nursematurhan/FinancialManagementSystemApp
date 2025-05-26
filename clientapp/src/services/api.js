import axios from "axios";

const API_BASE = "http://localhost:7006/api"; 

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

//Transactions
export const getTransactions = () => {
    return axios.get(`${API_BASE}/transactions/mine`, getAuthHeaders());
};

export const addTransaction = (transaction) => {
    return axios.post(`${API_BASE}/transactions`, transaction, getAuthHeaders());
};

export const updateTransaction = (id, transaction) => {
    return axios.put(`${API_BASE}/transactions/${id}`, transaction, getAuthHeaders());
};

export const deleteTransaction = (id) => {
    return axios.delete(`${API_BASE}/transactions/${id}`, getAuthHeaders());
};

//Transfers
export const getMyTransfers = () => {
    return axios.get(`${API_BASE}/transfers/mine`, getAuthHeaders());
};

export const getReceivedTransfers = () => {
    return axios.get(`${API_BASE}/transfers/received`, getAuthHeaders());
};

export const getTransferById = (id) => {
    return axios.get(`${API_BASE}/transfers/${id}`, getAuthHeaders());
};

export const addTransfer = (transfer) => {
    return axios.post(`${API_BASE}/transfers`, transfer, getAuthHeaders());
};

export const updateTransfer = (id, transfer) => {
    return axios.put(`${API_BASE}/transfers/${id}`, transfer, getAuthHeaders());
};

export const deleteTransfer = (id) => {
    return axios.delete(`${API_BASE}/transfers/${id}`, getAuthHeaders());
};

// Profile
export const getProfile = () => {
    return axios.get(`${API_BASE}/user/profile`, getAuthHeaders());
};


export const updateProfile = (data) => {
    return axios.put(`${API_BASE}/user/profile`, data, getAuthHeaders());
};

//ExchangeRate
export const getExchangeRate = (currencyCode) => {
    return axios.get(`${API_BASE}/realexchangerate/${currencyCode}`);
};

//Dashboard

export const getBalance = () => {
    return axios.get(`${API_BASE}/user/balance`, getAuthHeaders());
};
