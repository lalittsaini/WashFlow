"use client";

import { useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Search, Filter } from "lucide-react";

export default function AllOrdersClient({ initialOrders }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredOrders = initialOrders.filter((order) => {
    // Search Term Filter (Name or Phone)
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);

    // Status Filter
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-4 shadow-lg">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-64 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="RECEIVED">Received</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY">Ready</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">
          No orders found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
