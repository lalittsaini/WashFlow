"use server";

import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";


function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createOrder(orderData) {
  try {
    await dbConnect();
    
    const newOrder = new Order({
      orderId: generateOrderId(),
      ...orderData
    });

    const savedOrder = await newOrder.save();
    
    // Revalidate the pending orders path so it refreshes
    revalidatePath("/received");
    
    // We must return a plain object from Server Actions
    return { success: true, order: JSON.parse(JSON.stringify(savedOrder)) };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: error.message };
  }
}

export async function getOrdersByStatus(status) {
  try {
    await dbConnect();
    
    const query = status ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    
    return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    await dbConnect();
    
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status: newStatus },
      { new: true }
    ).lean();

    if (!updatedOrder) {
      return { success: false, error: "Order not found" };
    }

    // Trigger revalidations for all relevant dashboard pages
    revalidatePath("/received");
    revalidatePath("/processing");
    revalidatePath("/ready");
    
    return { success: true, order: JSON.parse(JSON.stringify(updatedOrder)) };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderPayment(orderId, newPaymentStatus) {
  try {
    await dbConnect();
    
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { payment: newPaymentStatus },
      { new: true }
    ).lean();

    if (!updatedOrder) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/ready");
    
    return { success: true, order: JSON.parse(JSON.stringify(updatedOrder)) };
  } catch (error) {
    console.error("Failed to update payment:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllOrders() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return { success: false, error: error.message };
  }
}

export async function getDashboardStats() {
  try {
    await dbConnect();
    
    // Aggregate status counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Total Orders count
    const totalOrders = await Order.countDocuments({});
    
    // Total Revenue (all orders or paid orders, let's provide both)
    const revenueStats = await Order.aggregate([
      { 
        $group: { 
          _id: null, 
          totalExpected: { $sum: "$total" },
          totalCollected: { 
            $sum: { $cond: [{ $eq: ["$payment", "PAID"] }, "$total", 0] } 
          }
        } 
      }
    ]);

    const formattedCounts = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const stats = {
      totalOrders,
      statusCounts: {
        RECEIVED: formattedCounts["RECEIVED"] || 0,
        PROCESSING: formattedCounts["PROCESSING"] || 0,
        READY: formattedCounts["READY"] || 0,
        DELIVERED: formattedCounts["DELIVERED"] || 0
      },
      revenue: {
        expected: revenueStats[0]?.totalExpected || 0,
        collected: revenueStats[0]?.totalCollected || 0
      }
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: error.message };
  }
}

