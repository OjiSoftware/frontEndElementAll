import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

export default function CheckoutButton({ 
    saleId: initialSaleId, 
    clientData, 
    items, 
    total,
    onOrderCreated 
}: { 
    saleId: number | null; 
    clientData?: any;
    items?: any[];
    total?: number;
    onOrderCreated?: (id: number) => void;
}) {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentSaleId, setCurrentSaleId] = useState<number | null>(initialSaleId);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const handleGeneratePayment = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        try {
            // Enviamos el saleId existente O los datos para crear uno nuevo
            const payload = currentSaleId 
                ? { saleId: currentSaleId } 
                : { clientData, items, total };

            const res = await fetch(`${API_URL}/payments/create-preference`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(
                    () => (
                        <span>
                            {data.error === "Stock insuficiente" ? (
                                <>
                                    Lo sentimos,{" "}
                                    <b className="font-black underline">
                                        {data.details?.replace("Stock insuficiente para ", "") || "un producto"}
                                    </b>{" "}
                                    no tiene stock suficiente.
                                </>
                            ) : (
                                data.details || data.error || "Error al procesar"
                            )}
                        </span>
                    ),
                    {
                        style: {
                            backgroundColor: "#f44336",
                            color: "white",
                            fontSize: "14px",
                            maxWidth: "400px",
                        },
                        duration: 5000,
                    },
                );

                setLoading(false);
                return;
            }

            if (data.preferenceId) {
                setPreferenceId(data.preferenceId);
                
                // Si acabamos de crear la venta, notificamos al padre
                if (data.saleId && !currentSaleId) {
                    setCurrentSaleId(data.saleId);
                    onOrderCreated?.(data.saleId);
                }

                toast.success("¡Stock reservado! Procediendo al pago...", {
                    style: { backgroundColor: "#4caf50", color: "white" },
                    duration: 2000,
                });
            }
        } catch (error) {
            console.error("❌ ERROR AL GENERAR PAGO:", error);
            toast.error("Error de conexión con el servidor.", {
                style: { backgroundColor: "#f44336", color: "white" },
            });
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
                    className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span>Verificando disponibilidad...</span>
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
                        Elegí tu método de pago preferido
                    </p>
                    <Wallet initialization={{ preferenceId }} />
                </div>
            )}
        </div>
    );
}
