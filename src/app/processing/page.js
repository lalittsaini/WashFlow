import { getOrdersByStatus, updateOrderStatus } from "@/app/actions/orderActions";
import OrderCard from "@/components/OrderCard";
import { WashingMachine } from "lucide-react";

export default async function ProcessingOrdersPage() {
  const result = await getOrdersByStatus("PROCESSING");
  const orders = result.success ? result.orders : [];

  const handleMarkAsReady = async (orderId) => {
    "use server";
    return await updateOrderStatus(orderId, "READY");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
          <WashingMachine className="w-8 h-8 text-yellow-500" />
          Cleaning Floor
        </h1>
        <p className="text-neutral-400 mt-2">Orders that are currently being washed, ironed, and folded.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">
          Cleaning floor is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              actionText="Mark as Ready"
              onAction={handleMarkAsReady}
            />
          ))}
        </div>
      )}
    </div>
  );
}
