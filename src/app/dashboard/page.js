import { getDashboardStats } from "@/app/actions/orderActions";
import { LayoutDashboard, ShoppingBag, Banknote, Inbox, WashingMachine, Truck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await getDashboardStats();
  const stats = result.success ? result.stats : null;

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Orders",
      val: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Expected Revenue",
      val: `₹${stats.revenue.expected}`,
      icon: Banknote,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      title: "Collected Revenue",
      val: `₹${stats.revenue.collected}`,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  const statusBreakdown = [
    { label: "Received", val: stats.statusCounts.RECEIVED, icon: Inbox, color: "text-blue-400" },
    { label: "Processing", val: stats.statusCounts.PROCESSING, icon: WashingMachine, color: "text-yellow-400" },
    { label: "Ready", val: stats.statusCounts.READY, icon: Truck, color: "text-emerald-400" },
    { label: "Delivered", val: stats.statusCounts.DELIVERED, icon: CheckCircle2, color: "text-purple-400" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-500" />
          Dashboard
        </h1>
        <p className="text-neutral-400 mt-2">Overview of laundry operations and financial metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className={`border rounded-2xl p-6 ${kpi.bg} ${kpi.border} flex items-center gap-6`}>
            <div className={`p-4 rounded-xl bg-neutral-950/50 ${kpi.color}`}>
              <kpi.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm font-medium">{kpi.title}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{kpi.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Orders by Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusBreakdown.map((status, index) => (
            <div key={index} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3">
              <status.icon className={`w-6 h-6 ${status.color}`} />
              <div>
                <p className="text-3xl font-bold text-white leading-none mb-1">{status.val}</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">{status.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
