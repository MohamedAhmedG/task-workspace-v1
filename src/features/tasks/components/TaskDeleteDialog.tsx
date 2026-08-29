import { Button } from "@/components/ui/button"
import { AlertDialog } from "@/components/ui/alert-dialog"

interface TaskDeleteDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
}

export function TaskDeleteDialog({
	open,
	onOpenChange,
	onConfirm,
}: TaskDeleteDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Delete task?"
			description="This action cannot be undone."
			footer={
				<Button
					className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
					onClick={onConfirm}
				>
					Delete
				</Button>
			}
		/>
	)
}
