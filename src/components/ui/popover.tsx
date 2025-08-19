import React from 'react'
import { cn } from '../../lib/utils'

interface PopoverProps {
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface PopoverTriggerProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  asChild?: boolean
}

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const PopoverContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({ isOpen: false, setIsOpen: () => {} })

const Popover: React.FC<PopoverProps> = ({ children, className, open, onOpenChange }) => {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false)
  
  const isOpen = open !== undefined ? open : internalIsOpen
  const setIsOpen = onOpenChange || setInternalIsOpen
  
  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={cn('relative', className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ 
  children, 
  onClick, 
  className,
  asChild = false 
}) => {
  const { isOpen, setIsOpen } = React.useContext(PopoverContext)
  
  const handleClick = () => {
    setIsOpen(!isOpen)
    onClick?.()
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      className: cn(children.props.className, className)
    })
  }
  
  return (
    <button
      onClick={handleClick}
      className={cn('outline-none', className)}
    >
      {children}
    </button>
  )
}

const PopoverContent: React.FC<PopoverContentProps> = ({ 
  children, 
  className, 
  align = 'center',
  side = 'bottom'
}) => {
  const { isOpen, setIsOpen } = React.useContext(PopoverContext)
  const contentRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])
  
  if (!isOpen) return null
  
  const getPositionClasses = () => {
    const positions = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2'
    }
    
    const alignments = {
      start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
      center: side === 'top' || side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0'
    }
    
    return `${positions[side]} ${alignments[align]}`
  }
  
  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-gray-800 p-1 text-gray-950 dark:text-gray-50 shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        getPositionClasses(),
        className
      )}
    >
      {children}
    </div>
  )
}

export { Popover, PopoverTrigger, PopoverContent }