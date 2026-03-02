
import React from "react"
import { cn } from "@/lib/utils"
import { useResponsive } from "@/hooks/useResponsive"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  minItemWidth?: number
  gap?: 'sm' | 'md' | 'lg'
  columns?: {
    smallPhone?: number
    standardPhone?: number
    largePhone?: number
    tablet?: number
    desktop?: number
  }
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  minItemWidth = 250,
  gap = 'md',
  columns
}) => {
  const { deviceType, isPhone, isTablet } = useResponsive()

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  // Default responsive columns if not specified
  const getColumns = () => {
    if (columns) {
      if (deviceType === 'small-phone') return `grid-cols-${columns.smallPhone || 1}`
      if (deviceType === 'standard-phone' || deviceType === 'large-phone') return `grid-cols-${columns.standardPhone || 2}`
      if (isTablet) return `grid-cols-${columns.tablet || 3}`
      return `grid-cols-${columns.desktop || 4}`
    }

    // Auto-responsive based on device type
    if (deviceType === 'small-phone') return 'grid-cols-1'
    if (isPhone) return 'grid-cols-2'
    if (isTablet) return 'grid-cols-3 lg:grid-cols-4'
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  }

  return (
    <div className={cn(
      'grid w-full',
      getColumns(),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

export default ResponsiveGrid
