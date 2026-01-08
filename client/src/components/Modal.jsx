import "../scss/Modal.scss";

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = "Potvrdit", cancelText = "Zrušit", type = "confirm" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
        </header>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <footer className="modal-footer">
          {cancelText && (
            <button className="btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button 
            className={type === "danger" ? "btn-confirm-danger" : "btn-confirm"} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  );
}
