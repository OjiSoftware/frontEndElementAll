import { useEffect, ReactNode } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: ReactNode; // <-- cambio aquí
    onCancel: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    title = "Confirmar acción",
    message,
    onCancel,
    onConfirm,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false,
}: ConfirmModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onCancel();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg text-center transform transition-all duration-200 scale-95 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {message} {/* Ahora puede ser JSX */}
                </p>
                <div className="mt-4 flex justify-center gap-3">
                    <button
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500/90 text-white rounded hover:bg-green-600 transition cursor-pointer"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
