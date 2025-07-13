export default function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                <p className="text-gray-800 text-lg mb-4">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
