import * as React from "react";
import { Root as ProgressRoot, Indicator as ProgressIndicator } from "@radix-ui/react-progress";
import { clsx } from "clsx";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressRoot
    ref={ref}
    className={clsx(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressIndicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressRoot>
));

Progress.displayName = "Progress";

export { Progress };
