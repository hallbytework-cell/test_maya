import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className = "", type = "text", ...props }, ref) => {
    const baseClasses =
      "flex h-10 w-full rounded-md bg-white border border-input bg-background px-3 py-2 text-base  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:text-green-600 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

    return (
      <input
        type={type}
        ref={ref}
        className={`${baseClasses + className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
