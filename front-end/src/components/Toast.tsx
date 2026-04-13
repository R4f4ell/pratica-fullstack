import { useEffect, useEffectEvent } from "react";
import "./toast.scss";

interface ToastProps {
  isVisible: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

function Toast({ isVisible, type, message, onClose }: ToastProps) {
  const handleClose = useEffectEvent(() => {
    onClose();
  });

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      handleClose();
    }, 3200);
    return () => window.clearTimeout(timeout);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      <div className={`toast toast-${type}`}>
        <span className={`toast-accent toast-accent-${type}`} />
        <span className="toast-message">{message}</span>
        <button className="toast-close" type="button" onClick={onClose} aria-label="Fechar aviso">
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
