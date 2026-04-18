import { getOrdersByStatus, updateOrderStatus } from "@/app/actions/orderActions";
import OrderCard from "@/components/OrderCard";
import { Inbox } from "lucide-react";

export default async function ReceivedOrdersPage() {
  const result = await getOrdersByStatus("RECEIVED");
  const orders = result.success ? result.orders : [];

  // Create a bound action or simply pass the server action
  // The server action signature is updateOrderStatus(orderId, newStatus)
  // We need to pass a function that takes `orderId` and returns a promise.
  const handleStartProcessing = async (orderId) => {
    "use server";
    return await updateOrderStatus(orderId, "PROCESSING");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
          <Inbox className="w-8 h-8 text-blue-500" />
          Incoming Orders
        </h1>
        <p className="text-neutral-400 mt-2">New unhandled orders that are waiting to be processed onto the cleaning floor.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">
          No incoming orders right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              actionText="Start Processing"
              onAction={handleStartProcessing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
