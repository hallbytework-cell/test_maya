
import React from "react"
import { cn } from "@/lib/utils"
import { useResponsive } from "@/hooks/useResponsive"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'lg',
  padding = 'md'
}) => {
  const { isPhone, isMobile } = useResponsive()

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  const paddingClasses = {
    none: '',
    sm: isPhone || isMobile ? 'px-3 py-2' : 'px-4 py-3',
    md: isPhone || isMobile ? 'px-4 py-3' : 'px-6 py-4',
    lg: isPhone || isMobile ? 'px-6 py-4' : 'px-8 py-6'
  }

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      isPhone || isMobile ? 'px-4' : '',
      className
    )}>
      {children}
    </div>
  )
}

export default ResponsiveContainer
