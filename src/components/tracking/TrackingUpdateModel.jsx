import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // 1. Import DialogDescription
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TrackingUpdateModal({ open, onOpenChange }) {
  const trackingDays = [
    {
      date: "Sunday, October 19, 2025",
      updates: [
        { time: "13:43", description: "Delivered to consignee", location: "Balagarh Natagarh_D (West Bengal)" },
        { time: "13:14", description: "Call placed to consignee", location: "Balagarh Natagarh_D (West Bengal)" },
        { time: "09:22", description: "Out for delivery", location: "Balagarh Natagarh_D (West Bengal)" },
        { time: "08:45", description: "Shipment arrived at destination hub", location: "Balagarh Natagarh_D (West Bengal)" }
      ]
    },
    {
      date: "Saturday, October 18, 2025",
      updates: [
        { time: "22:15", description: "In transit to destination", location: "Kolkata Hub (West Bengal)" },
        { time: "14:30", description: "Departed from origin facility", location: "Delhi Hub (Delhi)" }
      ]
    },
    {
      date: "Friday, October 17, 2025",
      updates: [
        { time: "18:20", description: "Shipment received at origin hub", location: "Delhi Hub (Delhi)" },
        { time: "10:15", description: "Pickup completed", location: "Noida (Uttar Pradesh)" }
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* --- THIS IS THE FIX ---
        Added 'bg-white' and 'shadow-lg' to force the background 
        to be opaque, which solves the overlapping UI bug.
      */}
      <DialogContent 
        className="max-w-2xl max-h-[85vh] bg-white shadow-lg" 
        data-testid="modal-tracking-updates"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tracking Updates</DialogTitle>
          {/* 2. Added this description to fix the console warning */}
          <DialogDescription className="sr-only">
            A detailed list of all shipping updates for your order.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-8">
            {trackingDays.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="text-base font-semibold mb-4" data-testid={`text-date-${dayIndex}`}>
                  {day.date}
                </h3>

                <div className="space-y-6 relative">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-green-500" />

                  {day.updates.map((update, updateIndex) => (
                    <div
                      key={updateIndex}
                      className="flex gap-4 relative"
                      data-testid={`update-${dayIndex}-${updateIndex}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0 mt-1 relative z-10" />

                      <div className="flex-1 pb-2">
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-sm font-medium">{update.time}</span>
                          <span className="text-sm text-gray-900">— {update.description}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3.5 h-3.5" />
                          {update.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}