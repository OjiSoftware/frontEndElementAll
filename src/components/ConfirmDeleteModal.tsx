import { useEffect } from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    itemName: string;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean; // nuevo prop opcional
}

export function ConfirmDeleteModal({
    isOpen,
    itemName,
    onCancel,
    onConfirm,
    isLoading = false,
}: ConfirmDeleteModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onCancel();
            }
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
                    Confirmar eliminación
                </h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    ¿Seguro que querés eliminar <b>{itemName}</b>?
                </p>
                <div className="mt-4 flex justify-center gap-3">
                    <button
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
