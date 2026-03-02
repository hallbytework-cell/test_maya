import React from "react";

const variantClasses = {
  default: "bg-soft-olive text-ivory-white hover:bg-soft-olive/80",
  secondary: "bg-terracotta text-ivory-white hover:bg-terracotta/80",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground border",
};

function Badge({ variant = "default", className = "", children }) {
  return (
    <div
      className={`inline-flex items-center rounded-full p-0 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export { Badge };
