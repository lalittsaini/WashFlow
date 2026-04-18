# WashFlow - Laundry Management System

WashFlow is a full-stack dashboard designed to streamline the operations of a centralized laundry business. Built on modern web technologies, it manages customer orders, dynamically tracks garment processing statuses, and offers high-level revenue analytics natively in the browser. 

---

## 🔹 Setup Instructions

### Prerequisites
- Node.js (v18+)
- Local MongoDB instance or a MongoDB Atlas Cluster (a seeded connection URI is pre-configured in `.env.local` to work out of the box).

### How to Run
1. Navigate to the root directory `c:\Users\Lenovo\OneDrive\Desktop\laundryManagmentSystem`.
2. Run `npm install` to ensure all library dependencies are bootstrapped.
3. Start the Next.js development server by running:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔹 Features Implemented

The application currently has the following seamlessly working features natively connected to a MongoDB database:
- **Order Creation System**: A rich, dynamic form validating customer details (Names, Indian specific Phone numbers) and garment carts. Instantly generates a unique `ORD-XXXXXX` ID.
- **Selectable Payment Modalities**: Staff can toggle an order as "Pay on Delivery (Unpaid)" or "Pay Now (Paid)" seamlessly upon checkout.
- **Physical Receipt Engine**: Native logic formats the UI upon triggering `window.print()` into a standard black-and-white, strictly formatted paper receipt to hand to customers while hiding sidebars and background panels.
- **Status Workflow Pipelines**: Three separate dashboards to manage workflow:
    - **Incoming Orders (`/received`)** -> Start Processing
    - **Cleaning Floor (`/processing`)** -> Mark as Ready 
    - **Deliveries (`/ready`)** -> Deliver & Collect Payment
- **Basic Dashboard Analytics**: Live-synced MongoDB aggregation metrics showing Total Collected/Expected Revenue (₹), Total lifetime orders, and a grid classifying exact volume per status level.
- **View All Orders System**: Comprehensive search platform merging smart `Name/Phone` client-side fuzzy searching coupled with status dropdown isolation filters.

---

## 🔹 AI Usage Report

### Which tools were used:
- **Google Gemini Pro 3.1** 
- **Mongoose Documentation**

### Sample Prompts Inputted:
- *"building a laundry managment system where Customer → Create Order → Process Order → Complete → Deliver"*

### What AI Got Wrong & Struggles:
1. **Mongoose Fast-Refresh Caching Issues:** When the user manually extended the schema inside `src/models/Order.js` to include "T-Shirt", the Next.js hot-reload system silently broke. The AI's schema compiling strategy `(mongoose.models.Order || mongoose.model)` cached old ENUM values actively in memory, leading to validation collisions on the browser side. 
2. **Infinite CSS Stretching:** The AI originally built the main dashboard view wrapping `<body>` with a standard `min-h-full` Tailwind class. Because modern CSS flexbox infinitely stretched without boundaries, it broke internal `overflow-auto` boundaries and removed the users scrolling abilities when orders breached 10+ items.

## 🔹 Tradeoffs

### What we skipped:
- **User Authentication & RBAC**: Skipped implementing a robust Login portal utilizing `NextAuth` separating *Admin* accounts (Dashboard access) vs *Standard Staff* accounts (Floor processing only). 
- **API Boundary Separation**: Utilized direct Next.js Server Actions connecting straight into MongoDB from the React code base, entirely bypassing formal `express.js` REST routing for speed of development. 

### What we'd improve with more time:
- **Pagination**: The `/all-orders` page fetches the entire lifetime database all at once; injecting `cursor pagination` querying will prevent memory issues.
- **Graphing Libraries**: Adding `Recharts` or `Chart.js` implementations to the Basic dashboard to give visual trendlines to the Revenue variables.


---

## 🔹 API Demo / UI

This application satisfies the frontend and server pipeline requirement directly through a **Simple Custom UI**. 
Every component visually rendered across `localhost:3000` fires direct payload mutations into MongoDB matching exactly the theoretical capabilities of an organized Postman collection. Launch the UI using `npm run dev` to demo the architecture.
