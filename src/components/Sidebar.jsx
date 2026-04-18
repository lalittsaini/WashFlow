"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, Inbox, WashingMachine, Truck, LayoutDashboard, List } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create Order", href: "/", icon: PlusCircle },
  { name: "All Orders", href: "/all-orders", icon: List },
  { name: "Incoming Orders", href: "/received", icon: Inbox },
  { name: "Cleaning Floor", href: "/processing", icon: WashingMachine },
  { name: "Deliveries", href: "/ready", icon: Truck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-col w-full md:w-64 h-auto md:h-screen bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-800 text-white p-2 md:p-4 print:hidden flex-none">
      <div className="md:mb-8 px-2 py-2 md:py-0 flex items-center justify-center md:justify-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm md:text-base">
          L
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-wide hidden md:block">WashFlow</h1>
      </div>
      
      <nav className="flex flex-row md:flex-col md:flex-1 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto py-2 md:py-0 [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-3 px-3 py-2 md:py-3 rounded-lg transition-colors group flex-none md:flex-auto ${
                isActive 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "hover:bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
              title={item.name}
            >
              <item.icon className="w-5 h-5 md:w-5 md:h-5 shrink-0" />
              <span className="text-[10px] md:text-base font-medium whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-2 py-4 hidden md:block">
        <p className="text-xs text-neutral-500 text-center">
          Laundry Management System v1.0
        </p>
      </div>
    </div>
  );
}
