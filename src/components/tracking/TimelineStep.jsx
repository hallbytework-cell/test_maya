import { Check } from "lucide-react";

export default function TimelineStep({
  icon,
  title,
  description,
  date,
  status, // 'completed' | 'active' | 'pending'
  isLast = false
}) {
  // Helper to get colors based on standard Tailwind classes
  const getNodeStyles = () => {
    switch (status) {
      case "completed":
        return "bg-green-500 border-green-500";
      case "active":
        return "bg-green-500 border-green-500";
      case "pending":
        return "bg-white border-gray-300";
      default:
        return "bg-white border-gray-300";
    }
  };

  const getLineColor = () => {
      if (status === "completed") return "bg-green-500";
      return "bg-gray-200";
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        {/* The Circle Node */}
        <div
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${getNodeStyles()}`}
        >
          {status === "completed" ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            // Icon color for active vs. pending
            <div className={status === 'active' ? 'text-white' : 'text-gray-500'}>
                {icon}
            </div>
          )}
        </div>

        {/* The Connecting Line */}
        {!isLast && (
          <div
            className={`w-0.5 flex-1 -my-1 ${getLineColor()}`}
            style={{ minHeight: "40px" }}
          />
        )}
      </div>

      <div className="flex-1 pb-8 pt-1">
        {/* Text color for pending vs. others */}
        <h3 className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-gray-900'}`}>
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-0.5">
          {description}
        </p>

        {date && (
          <p className="text-xs text-gray-400 mt-1">
            {date}
          </p>
        )}
        
        {status === 'active' && (
             <p className="text-xs text-blue-600 font-medium mt-2 cursor-pointer">
                See more updates ⌄
             </p>
        )}
      </div>
    </div>
  );
}