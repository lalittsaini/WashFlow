import { getAllOrders } from "@/app/actions/orderActions";
import AllOrdersClient from "./AllOrdersClient";
import { List } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AllOrdersPage() {
  const result = await getAllOrders();
  const orders = result.success ? result.orders : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
          <List className="w-8 h-8 text-blue-500" />
          View Orders
        </h1>
        <p className="text-neutral-400 mt-2">View and filter through all historical and active orders.</p>
      </div>

      <AllOrdersClient initialOrders={orders} />
    </div>
  );
}
