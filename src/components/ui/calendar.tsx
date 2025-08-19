import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '../../lib/utils'

interface CalendarProps {
  selected?: Date | Date[]
  onSelect?: (date: Date | undefined) => void
  className?: string
}

const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  className
}) => {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    if (onSelect) {
      onSelect(clickedDate)
    }
  }
  
  const isSelected = (day: number) => {
    if (!selected) return false
    if (selected instanceof Date) {
      const date = new Date(year, month, day)
      return selected.toDateString() === date.toDateString()
    }
    return false
  }
  
  const isToday = (day: number) => {
    const date = new Date(year, month, day)
    return today.toDateString() === date.toDateString()
  }
  
  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            'p-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            isSelected(day) && 'bg-blue-600 text-white hover:bg-blue-700',
            isToday(day) && !isSelected(day) && 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
            'text-gray-700 dark:text-gray-300'
          )}
        >
          {day}
        </button>
      )
    }
    
    return days
  }
  
  return (
    <div className={cn('p-4 bg-white dark:bg-gray-800 rounded-lg border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          className="p-1 h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthNames[month]} {year}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          className="p-1 h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  )
}

export { Calendar }