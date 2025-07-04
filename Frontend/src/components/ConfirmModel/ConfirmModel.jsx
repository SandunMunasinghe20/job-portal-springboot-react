import './ConfirmModel.css'

export default function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <p>{message}</p>
                <div className="confirm-modal-buttons">
                    <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-confirm" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
}
