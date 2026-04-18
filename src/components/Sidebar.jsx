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
    <div className="flex flex-col w-64 h-screen bg-neutral-900 border-r border-neutral-800 text-white p-4 print:hidden">
      <div className="mb-8 px-2 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          L
        </div>
        <h1 className="text-xl font-bold tracking-wide">WashFlow</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "hover:bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-2 py-4">
        <p className="text-xs text-neutral-500 text-center">
          Laundry Management System v1.0
        </p>
      </div>
    </div>
  );
}
