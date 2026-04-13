import "./confirmDialog.scss";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  isSubmitting = false,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-dialog-overlay"
      onClick={() => {
        if (!isSubmitting) {
          onCancel();
        }
      }}
    >
      <div className="confirm-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="confirm-dialog-badge">Confirmacao</div>
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-description">{description}</p>

        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-button confirm-dialog-button-secondary"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>

          <button
            className="confirm-dialog-button confirm-dialog-button-danger"
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            aria-label="Excluindo produto"
          >
            {isSubmitting ? <span className="confirm-dialog-spinner" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
