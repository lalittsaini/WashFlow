"use client";

import { useState } from "react";
import { Package, User, Phone, CheckCircle, ArrowRight } from "lucide-react";

export default function OrderCard({ order, actionText, onAction, secondaryActionText, onSecondaryAction }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await onAction(order.orderId);
      if (!res.success) {
        setError(res.error);
      }
    } catch (err) {
      setError("Action failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    RECEIVED: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    PROCESSING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    READY: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    DELIVERED: "bg-purple-500/20 text-purple-400 border border-purple-500/30"
  };

  const paymentColors = {
    UNPAID: "bg-red-500/20 text-red-400 border border-red-500/30",
    PAID: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 transition-all hover:border-neutral-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-lg text-white">{order.orderId}</h3>
          </div>
          <p className="text-sm text-neutral-400">
            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentColors[order.payment]}`}>
            {order.payment}
          </span>
        </div>
      </div>

      <div className="flex gap-6 mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-300">
          <User className="w-4 h-4 text-neutral-500" />
          <span>{order.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-300">
          <Phone className="w-4 h-4 text-neutral-500" />
          <span>{order.customerPhone}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm text-neutral-500 uppercase tracking-wider font-semibold mb-3">Items</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-neutral-950 p-2 rounded-lg">
              <span className="text-white text-sm">{item.quantity}x {item.type}</span>
              <span className="text-neutral-400 text-sm">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Total: ₹{order.total}
        </div>
        
        <div className="flex gap-3">
          {error && <span className="text-red-400 text-sm self-center">{error}</span>}
          
          {secondaryActionText && onSecondaryAction && (
            <button
              onClick={() => onSecondaryAction(order.orderId)}
              disabled={loading}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {secondaryActionText}
            </button>
          )}

          {actionText && onAction && (
            <button
              onClick={handleAction}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 text-sm"
            >
              {loading ? "Processing..." : (
                <>
                  {actionText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
