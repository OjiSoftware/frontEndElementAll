import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

export default function CheckoutStatus() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [search, setSearch] = useState("");

    // Parámetros de Mercado Pago
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");
    const externalReference = searchParams.get("external_reference");

    // 1. PROTECCIÓN DE RUTA: Si no hay status ni paymentId, redirigir al Home
    useEffect(() => {
        if (!status && !paymentId) {
            navigate("/", { replace: true });
        }
    }, [status, paymentId, navigate]);

    useEffect(() => {
        if (status === "approved" && clearCart) {
            clearCart();
            console.log("Pago aprobado: Carrito vaciado.");
        }
    }, [status, clearCart]);

    // Lógica de UI basada en el estado
    let StatusIcon = CheckCircleIcon;
    let iconColor = "text-green-500";
    let title = "¡Pago exitoso!";
    let message = "Tu orden ha sido registrada y el pago se procesó correctamente.";

    if (status === "rejected" || status === "null") {
        StatusIcon = XCircleIcon;
        iconColor = "text-red-500";
        title = "El pago fue rechazado";
        message = "Hubo un problema al procesar tu pago. Por favor, intentá con otro medio.";
    } else if (status === "pending" || status === "in_process") {
        StatusIcon = ClockIcon;
        iconColor = "text-yellow-500";
        title = "Pago pendiente";
        message = "Estamos esperando la confirmación de Mercado Pago.";
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
            <Navbar search={search} setSearch={setSearch} />

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200 max-w-lg w-full text-center font-lato animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-center mb-6">
                        <StatusIcon
                            className={`w-24 h-24 ${iconColor}`}
                            strokeWidth={1.5}
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        {title}
                    </h1>
                    <p className="text-gray-600 text-[1.05rem] mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* SECCIÓN DE DATOS DEL PAGO Y CLIENTE */}
                    {(paymentId || externalReference) && (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-8 text-left text-sm space-y-4">
                            {/* Datos de la Orden */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Detalles de la Operación
                                </h3>
                                {externalReference && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Orden:
                                        </span>
                                        <span className="font-mono font-bold text-gray-700">
                                            #{externalReference}
                                        </span>
                                    </div>
                                )}
                                {paymentId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Comprobante MP:
                                        </span>
                                        <span className="font-mono text-gray-700">
                                            {paymentId}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info del Cliente (Simulada o desde Contexto si la tenés) */}
                            <div className="pt-3 border-t border-gray-200">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Información de Entrega
                                </h3>
                                <div className="flex items-start gap-3">
                                    <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="text-gray-600 italic">
                                        Los detalles del envío han sido enviados
                                        al correo registrado en tu cuenta de
                                        Mercado Pago.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        {(status === "rejected" || status === "null") && (
                            <button
                                onClick={() => navigate("/cart")}
                                className="flex-1 py-3 px-4 bg-[#2f3027] text-white font-bold rounded-xl hover:bg-black transition cursor-pointer"
                            >
                                Volver a intentar
                            </button>
                        )}
                        <button
                            onClick={() => (window.location.href = "/")} // Forzamos recarga total si querés que "limpie" todo
                            className={`flex-1 py-3 px-4 font-bold rounded-xl transition shadow-sm cursor-pointer ${
                                status === "rejected" || status === "null"
                                    ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    : "bg-[#16a34a] text-white hover:bg-[#15803d] shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.4)] active:scale-[0.98]"
                            }`}
                        >
                            Volver a la tienda
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
