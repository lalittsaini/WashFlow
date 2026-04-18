import { getOrdersByStatus, updateOrderStatus, updateOrderPayment } from "@/app/actions/orderActions";
import OrderCard from "@/components/OrderCard";
import { Truck } from "lucide-react";

export default async function ReadyOrdersPage() {
  const result = await getOrdersByStatus("READY");
  const orders = result.success ? result.orders : [];

  const handleDeliver = async (orderId) => {
    "use server";
    // Mark payment as paid
    await updateOrderPayment(orderId, "PAID");
    // Mark status as delivered
    return await updateOrderStatus(orderId, "DELIVERED");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
          <Truck className="w-8 h-8 text-emerald-500" />
          Deliveries
        </h1>
        <p className="text-neutral-400 mt-2">Orders that are completely ready for pickup or delivery.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">
          No orders ready for delivery at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              actionText="Deliver & Collect Payment"
              onAction={handleDeliver}
            />
          ))}
        </div>
      )}
    </div>
  );
}
