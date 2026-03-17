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
    ExclamationTriangleIcon, // Agregamos este icono para el pago abandonado
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
    const reason = searchParams.get("reason");

    // 1. PROTECCIÓN DE RUTA
    useEffect(() => {
        if (!status && !paymentId) {
            navigate("/", { replace: true });
        }
    }, [status, paymentId, navigate]);

    useEffect(() => {
        if (status === "approved" && clearCart) {
            clearCart();
            // Limpiamos también el timer si el pago fue un éxito
            sessionStorage.removeItem("currentSaleId");
            sessionStorage.removeItem("saleExpiresAt");
            console.log("Pago aprobado: Carrito vaciado y sesión limpia.");
        }
    }, [status, clearCart]);

    // 2. LÓGICA DE UI BASADA EN EL ESTADO DE MERCADO PAGO
    let StatusIcon = CheckCircleIcon;
    let iconColor = "text-green-500";
    let title = "¡Pago exitoso!";
    let message =
        "Tu orden ha sido registrada y el pago se procesó correctamente.";

    if (status === "rejected") {
        StatusIcon = XCircleIcon;
        iconColor = "text-red-500";

        if (reason === "expired") {
            title = "Reserva expirada";
            message =
                "El tiempo de 10 minutos para completar el pago ha terminado y el stock ha sido liberado. Por favor, armá tu carrito nuevamente.";
        } else {
            title = "El pago fue rechazado";
            message =
                "Hubo un problema al procesar el cobro con tu tarjeta. Por favor, intentá con otro medio de pago.";
        }
    } else if (status === "null") {
        StatusIcon = ExclamationTriangleIcon;
        iconColor = "text-orange-500";
        title = "Pago incompleto";
        message =
            "Cancelaste el proceso de pago. Podés volver al checkout e intentarlo de nuevo (tu reserva sigue activa hasta que expire el tiempo).";
    } else if (status === "pending" || status === "in_process") {
        StatusIcon = ClockIcon;
        iconColor = "text-yellow-500";
        title = "Pago pendiente";
        message =
            "Estamos esperando la confirmación de Mercado Pago. Te avisaremos cuando se acredite.";
    }

    let nextStepsTitle = "Siguientes pasos";
    let nextStepsMessage =
        "Te enviaremos la confirmación de tu compra y las actualizaciones de envío al correo electrónico que ingresaste.";

    if (
        status === "rejected" ||
        reason === "expired" ||
        reason === "admin_cancel"
    ) {
        nextStepsTitle = "Atención con tu reserva";
        nextStepsMessage =
            "Los productos han vuelto al inventario general. Para asegurar tu compra, por favor iniciá el proceso de pago nuevamente desde el carrito.";
    } else if (status === "null") {
        nextStepsTitle = "¿Tuviste algún problema?";
        nextStepsMessage =
            "Tu reserva sigue activa por unos minutos. Podés intentar completar el pago con otro medio o revisar tus datos de facturación.";
    } else if (status === "pending") {
        nextStepsTitle = "Confirmación en camino";
        nextStepsMessage =
            "En cuanto Mercado Pago nos notifique la acreditación, te enviaremos el comprobante por correo.";
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
                                {paymentId && paymentId !== "null" && (
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

                            {/* Info de Entrega - TEXTO CORREGIDO */}
                            <div className="pt-3 border-t border-gray-200">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    {nextStepsTitle}
                                </h3>
                                <div className="flex items-start gap-3">
                                    <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                    <div className="text-gray-600 italic">
                                        {nextStepsMessage}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        {(status === "rejected" || status === "null") && (
                            <button
                                onClick={() => navigate("/checkout")}
                                className="flex-1 py-3 px-4 bg-[#2f3027] text-white font-bold rounded-xl hover:bg-black transition cursor-pointer"
                            >
                                Volver al checkout
                            </button>
                        )}
                        <button
                            onClick={() => (window.location.href = "/")}
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
