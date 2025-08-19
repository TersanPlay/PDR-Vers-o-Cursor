import { useEffect, useCallback } from 'react'
import { Interaction } from '../types'

interface UseAutoStatusUpdateProps {
  interactions: Interaction[]
  onUpdateInteraction: (updatedInteraction: Interaction) => void
}

export const useAutoStatusUpdate = ({ interactions, onUpdateInteraction }: UseAutoStatusUpdateProps) => {
  
  const checkAndUpdateStatus = useCallback(() => {
    const now = new Date()
    
    interactions.forEach(interaction => {
      // Só aplica a lógica automática se não foi cancelado manualmente
      if (interaction.status === 'cancelado') {
        return
      }
      
      // Só aplica para eventos com data agendada
      if (interaction.type !== 'evento' || !interaction.scheduledDate) {
        return
      }
      
      const scheduledDate = new Date(interaction.scheduledDate)
      const isToday = scheduledDate.toDateString() === now.toDateString()
      
      // Se é hoje e tem horários definidos
      if (isToday && interaction.eventStartTime && interaction.eventEndTime) {
        const [startHour, startMinute] = interaction.eventStartTime.split(':').map(Number)
        const [endHour, endMinute] = interaction.eventEndTime.split(':').map(Number)
        
        const startTime = new Date(now)
        startTime.setHours(startHour, startMinute, 0, 0)
        
        const endTime = new Date(now)
        endTime.setHours(endHour, endMinute, 0, 0)
        
        let newStatus = interaction.status
        
        // Lógica de atualização do status
        if (now >= endTime && interaction.status !== 'concluido') {
          // Evento terminou - marcar como concluído
          newStatus = 'concluido'
        } else if (now >= startTime && now < endTime && interaction.status === 'pendente') {
          // Evento em andamento - marcar como em progresso
          newStatus = 'em_progresso'
        } else if (now >= startTime && now < endTime && interaction.status === 'em_progresso') {
          // Continua em progresso, mas pode mudar para em andamento se necessário
          newStatus = 'em_andamento'
        }
        
        // Atualizar se o status mudou
        if (newStatus !== interaction.status) {
          const updatedInteraction: Interaction = {
            ...interaction,
            status: newStatus,
            updatedAt: new Date()
          }
          
          onUpdateInteraction(updatedInteraction)
        }
      }
      // Se é um evento que já passou da data agendada e ainda está pendente
      else if (scheduledDate < now && interaction.status === 'pendente') {
        const updatedInteraction: Interaction = {
          ...interaction,
          status: 'em_progresso',
          updatedAt: new Date()
        }
        
        onUpdateInteraction(updatedInteraction)
      }
    })
  }, [interactions, onUpdateInteraction])
  
  useEffect(() => {
    // Executa a verificação imediatamente
    checkAndUpdateStatus()
    
    // Configura um intervalo para verificar a cada minuto
    const interval = setInterval(checkAndUpdateStatus, 60000) // 60 segundos
    
    return () => clearInterval(interval)
  }, [checkAndUpdateStatus])
  
  return { checkAndUpdateStatus }
}