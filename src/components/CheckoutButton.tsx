import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Loader2, CreditCard } from "lucide-react";

// Inicializamos Mercado Pago
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

export default function CheckoutButton({ saleId }: { saleId: number }) {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const handleGeneratePayment = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        try {
            // Petición limpia y pública: solo enviamos el ID de la venta
            const res = await fetch(`${API_URL}/payments/create-preference`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ saleId }),
            });

            if (!res.ok)
                throw new Error(
                    "Error al comunicarse con el servidor de pagos.",
                );

            const data = await res.json();

            if (data.preferenceId) {
                setPreferenceId(data.preferenceId);
            } else {
                throw new Error(
                    "El servidor no devolvió el ID de preferencia.",
                );
            }
        } catch (error) {
            console.error("❌ ERROR AL GENERAR PAGO:", error);
            alert(
                error instanceof Error ? error.message : "Error de conexión.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mt-6 border-t border-gray-100 pt-6">
            {!preferenceId ? (
                <button
                    onClick={handleGeneratePayment}
                    disabled={loading}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span>Conectando con Mercado Pago...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            <span>Pagar de forma segura</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 text-center mb-3 font-lato">
                        Elegí cómo querés pagar
                    </p>
                    <Wallet
                        initialization={{ preferenceId }}
                    />
                </div>
            )}
        </div>
    );
}
