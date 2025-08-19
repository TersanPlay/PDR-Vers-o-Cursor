import React from 'react'
import { cn } from '../../lib/utils'

interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
}

const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className,
  orientation = 'vertical'
}) => {
  const getScrollClasses = () => {
    switch (orientation) {
      case 'horizontal':
        return 'overflow-x-auto overflow-y-hidden'
      case 'both':
        return 'overflow-auto'
      default:
        return 'overflow-y-auto overflow-x-hidden'
    }
  }

  return (
    <div
      className={cn(
        'relative',
        getScrollClasses(),
        'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
        'scrollbar-track-gray-100 dark:scrollbar-track-gray-800',
        'hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500',
        className
      )}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(156 163 175) rgb(243 244 246)'
      }}
    >
      {children}
    </div>
  )
}

export { ScrollArea }