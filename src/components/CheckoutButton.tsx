import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Loader2, CreditCard } from "lucide-react";

// Inicializamos con la Public Key
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

export default function CheckoutButton({ saleId }: { saleId: number }) {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const handleGeneratePayment = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Obtenemos el token (Ojo: Si el carrito es público para invitados, quizás debas quitar esta validación)
        const token = localStorage.getItem("token");

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/payments/create-preference`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Solo enviamos el token si existe y es necesario
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ saleId: Number(saleId) }),
            });

            if (res.status === 401) {
                throw new Error("Sesión expirada. Volvé a loguearte.");
            }

            if (!res.ok) throw new Error("Error al generar el pago");

            const data = await res.json();

            if (data.preferenceId) {
                setPreferenceId(data.preferenceId);
            } else {
                console.error("No se recibió preferenceId del backend");
            }
        } catch (error) {
            console.error("❌ ERROR AL GENERAR PAGO:", error);
            alert(error instanceof Error ? error.message : "Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mt-6 border-t border-gray-200 pt-6">
            {!preferenceId ? (
                <button
                    onClick={handleGeneratePayment}
                    disabled={loading}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span>Conectando de forma segura...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            <span>Proceder al Pago</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 text-center mb-4">
                        Seleccioná tu método de pago preferido
                    </p>
                    {/* El contenedor del Wallet se expandirá al 100% de este div */}
                    <Wallet initialization={{ preferenceId }} />
                </div>
            )}
        </div>
    );
}
