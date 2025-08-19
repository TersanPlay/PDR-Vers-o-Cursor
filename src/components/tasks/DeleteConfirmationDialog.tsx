import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../ui/dialog'
import { Button } from '../ui/button'
import { AlertTriangle } from 'lucide-react'
import { Task } from '../../types'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  task: Task | null
  onClose: () => void
  onConfirm: () => void
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700 mb-2">
            Tem certeza que deseja excluir a tarefa:
          </p>
          <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded border-l-4 border-red-500">
            {task?.title}
          </p>
          <p className="text-sm text-gray-600 mt-3">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1"
          >
            Excluir Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationDialog