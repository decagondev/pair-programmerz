import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CreateRoomForm } from './CreateRoomForm'

/**
 * Create room dialog component
 * 
 * Modal dialog for creating a new interview room.
 */
interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateRoomDialog({
  open,
  onOpenChange,
}: CreateRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Interview Room</DialogTitle>
          <DialogDescription>
            Create a new room for a pair programming interview. You can select
            a task or create a custom interview.
          </DialogDescription>
        </DialogHeader>
        <CreateRoomForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

