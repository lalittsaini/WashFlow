"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Printer } from "lucide-react";
import { createOrder } from "@/app/actions/orderActions";
import { GARMENT_PRICES } from "@/config/prices";

export default function CreateOrderPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState([]);
  
  const [currentType, setCurrentType] = useState("Shirt");
  const [currentQty, setCurrentQty] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const [paymentMode, setPaymentMode] = useState("UNPAID");

  const handleAddItem = () => {
    if (currentQty < 1) return;
    const price = GARMENT_PRICES[currentType];
    const newItem = { type: currentType, quantity: parseInt(currentQty), price };
    setItems([...items, newItem]);
    setCurrentQty(1);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || items.length === 0) {
      setErrorMsg("Please fill all customer details and add at least one item.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await createOrder({
      customerName,
      customerPhone,
      items,
      total,
      payment: paymentMode
    });

    if (res.success) {
      setSuccessMsg(`Order ${res.order.orderId} created successfully!`);
      setLastOrder(res.order);
      setCustomerName("");
      setCustomerPhone("");
      setItems([]);
    } else {
      setErrorMsg(res.error || "Failed to create order");
      setLastOrder(null);
    }
    setLoading(false);
  };

  return (
    <>
    <div className="max-w-4xl mx-auto print:hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          New Order
        </h1>
        <p className="text-neutral-400 mt-2">Take a new laundry order from a customer.</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <p>{successMsg}</p>
          </div>
          {lastOrder && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-lg shadow-emerald-900/20"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          )}
        </div>
      )}
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer Details & Add Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Add Garments</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-400 mb-1">Type</label>
                <select
                  value={currentType}
                  onChange={(e) => setCurrentType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {Object.keys(GARMENT_PRICES).map(type => (
                    <option key={type} value={type}>{type} (₹{GARMENT_PRICES[type]})</option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-neutral-400 mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={currentQty}
                  onChange={(e) => setCurrentQty(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
            
            {items.length === 0 ? (
              <p className="text-neutral-500 text-sm text-center py-8">No items added yet.</p>
            ) : (
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <div>
                      <p className="font-medium text-white">{item.type}</p>
                      <p className="text-xs text-neutral-400">{item.quantity} x ₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-blue-400">₹{item.quantity * item.price}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-neutral-800 pt-4 mb-6">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Payment Option</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-4"
              >
                <option value="UNPAID">Pay on Delivery (Unpaid)</option>
                <option value="PAID">Pay Now (Paid)</option>
              </select>

              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-blue-400">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
            >
              {loading ? "Creating..." : "Confirm & Create Order"}
            </button>
          </div>
        </div>
      </form>
    </div>

    {/* Printable Receipt area - Only visible during printing */}
    {lastOrder && (
      <div className="hidden print:block w-full max-w-sm mx-auto bg-white text-black text-sm">
        <div className="text-center pb-4 border-b border-gray-300 mb-4">
          <h2 className="text-2xl font-bold font-mono">WashFlow</h2>
          <p className="text-gray-500 text-xs">Laundry & Dry Cleaning</p>
          <p className="text-gray-500 text-xs mt-2">Tel: +91 80000 12345</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between">
            <span className="font-semibold">Order ID:</span>
            <span>{lastOrder.orderId}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-semibold">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-semibold">Customer:</span>
            <span>{lastOrder.customerName}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-semibold">Phone:</span>
            <span>{lastOrder.customerPhone}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-semibold">Payment:</span>
            <span className="uppercase">{lastOrder.payment}</span>
          </div>
        </div>

        <div className="border-t border-b border-gray-300 py-3 mb-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="pb-1 font-semibold">Item</th>
                <th className="pb-1 text-center font-semibold">Qty</th>
                <th className="pb-1 text-right font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {lastOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1 uppercase text-xs">{item.type}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span>₹{lastOrder.total}</span>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 font-mono">
          <p>Thank you for choosing WashFlow!</p>
          <p>Visit again.</p>
        </div>
      </div>
    )}
    </>
  );
}
