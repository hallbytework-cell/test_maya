
import React from "react"
import { cn } from "@/lib/utils"
import { useResponsive } from "@/hooks/useResponsive"

interface ResponsiveTextProps {
  children: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  className,
  as
}) => {
  const { isPhone, isTablet } = useResponsive()

  const getVariantClasses = () => {
    const baseClasses = {
      h1: isPhone ? 'text-2xl sm:text-3xl font-bold' : isTablet ? 'text-3xl lg:text-4xl font-bold' : 'text-4xl lg:text-5xl xl:text-6xl font-bold',
      h2: isPhone ? 'text-xl sm:text-2xl font-semibold' : isTablet ? 'text-2xl lg:text-3xl font-semibold' : 'text-3xl lg:text-4xl font-semibold',
      h3: isPhone ? 'text-lg sm:text-xl font-medium' : isTablet ? 'text-xl lg:text-2xl font-medium' : 'text-2xl lg:text-3xl font-medium',
      h4: isPhone ? 'text-base sm:text-lg font-medium' : isTablet ? 'text-lg lg:text-xl font-medium' : 'text-xl lg:text-2xl font-medium',
      body: isPhone ? 'text-sm sm:text-base' : isTablet ? 'text-base lg:text-lg' : 'text-base lg:text-lg',
      caption: isPhone ? 'text-xs sm:text-sm' : 'text-sm'
    }
    return baseClasses[variant]
  }

  const Component = as || (variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p')

  return React.createElement(
    Component,
    {
      className: cn(getVariantClasses(), className)
    },
    children
  )
}

export default ResponsiveText
