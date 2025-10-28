import React, { useState } from 'react';
import Dashboard from "./Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import moment from 'moment';
import toast from "react-hot-toast";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx"; // ✅ Import

const Filter = () => {
    useUser();

    const [type, setType] = useState("income");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [keyword, setKeyword] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
                type,
                startDate,
                endDate,
                keyword,
                sortField,
                sortOrder
            });
            console.log("transactions:", response.data);
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            toast.error(error.response?.data?.message || "Failed to fetch transactions. Please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dashboard activeMenu="Filter"> {/* ✅ Match with Sidebar label */}
            <div className="my-5 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Filter Transactions</h2>
                </div>

                <div className="card p-4 mb-4">
                    <h5 className="text-lg font-semibold">Select the filters</h5>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                        
                        {/* Type Filter */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium mb-1">Type</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label htmlFor="startdate" className="block text-sm font-medium mb-1">Start Date</label>
                            <input
                                id="startdate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label htmlFor="enddate" className="block text-sm font-medium mb-1">End Date</label>
                            <input
                                id="enddate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        {/* Sort Field */}
                        <div>
                            <label htmlFor="sortfield" className="block text-sm font-medium mb-1">Sort Field</label>
                            <select
                                id="sortfield"
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="category">Category</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label htmlFor="sortorder" className="block text-sm font-medium mb-1">Sort Order</label>
                            <select
                                id="sortorder"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="sm:col-span-2 md:col-span-2 flex items-end">
                            <div className="w-full">
                                <label htmlFor="keyword" className="block text-sm font-medium mb-1">Search</label>
                                <input
                                    id="keyword"
                                    type="text"
                                    placeholder="Search..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="ml-2 mb-0 p-2 bg-purple-800 hover:bg-purple-900 text-white rounded flex items-center justify-center cursor-pointer"
                                style={{ height: '42px', width: '42px' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="card p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-2xl font-semibold">
                            Transactions
                        </h5>
                    </div>

                    {transactions.length === 0 && !loading ? (
                        <p className="text-gray-500">
                            Select the filter and click apply to see transactions
                        </p>
                    ) : null}

                    {transactions.map((transaction) => (
                        <TransactionInfoCard
                            key={transaction.id}
                            title={transaction.name}
                            icon={transaction.icon}
                            date={moment(transaction.date).format("Do MMM YYYY")}
                            amount={transaction.amount}
                            type={type} 
                            hideDeleteBtn
                        />
                    ))}
                </div>
            </div>
        </Dashboard>
    );
};

export default Filter;
