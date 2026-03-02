import { Package, Truck, MapPin, Home } from "lucide-react";
import TimelineStep from "./TimelineStep";

export default function OrderTrackingTimeline() {
  const steps = [
    {
      title: "Order Received",
      description: "We have received your order",
      date: "20-Dec-2019",
      status: "completed",
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: "Shipped",
      description: "Your order has been shipped",
      date: "20-Dec-2019",
      status: "completed",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      title: "In Transit",
      description: "Your order is on the way",
      date: "21-Dec-2019",
      status: "active", // This makes it the green node
      icon: <Truck className="w-5 h-5" />,
    },
    {
      title: "Out for Delivery",
      description: "Your order is out for delivery",
      date: null,
      status: "pending",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      title: "Delivered",
      description: "Your order has been delivered",
      date: null,
      status: "pending",
      icon: <Home className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Track Order</h2>
        <span className="text-gray-400">⌄</span>
      </div>
      
      <div className="pl-2">
        {steps.map((step, index) => (
          <TimelineStep
            key={index}
            {...step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}