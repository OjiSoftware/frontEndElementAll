import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

export default function CheckoutStatus() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [search, setSearch] = useState("");

    // Leemos los parámetros que Mercado Pago nos manda por la URL
    const status = searchParams.get("status"); // "success", "failure" o "pending"
    const paymentId = searchParams.get("payment_id");
    const externalReference = searchParams.get("external_reference"); // Tu saleId de ElementAll

    useEffect(() => {
        // Si el pago fue exitoso, vaciamos el carrito del cliente para que no vuelva a comprar lo mismo por error
        if (status === "success" && clearCart) {
            clearCart();
        }
    }, [status, clearCart]);

    // Configuramos la interfaz dependiendo del estado del pago
    let StatusIcon = CheckCircleIcon;
    let iconColor = "text-green-500";
    let title = "¡Pago exitoso!";
    let message =
        "Tu orden ha sido registrada y el pago se procesó correctamente.";

    if (status === "failure") {
        StatusIcon = XCircleIcon;
        iconColor = "text-red-500";
        title = "El pago fue rechazado";
        message =
            "Hubo un problema al procesar tu pago. Por favor, intentá con otro medio de pago.";
    } else if (status === "pending") {
        StatusIcon = ClockIcon;
        iconColor = "text-yellow-500";
        title = "Pago pendiente";
        message =
            "Estamos esperando la confirmación de Mercado Pago. Si pagaste en efectivo (Rapipago/PagoFácil), puede demorar unas horas.";
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

                    {/* Solo mostramos los datos extra si Mercado Pago los mandó */}
                    {(paymentId || externalReference) && (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-8 text-left text-sm space-y-3">
                            {externalReference && (
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                    <span className="font-bold text-gray-700">
                                        Orden de compra (ElementAll):
                                    </span>
                                    <span className="text-gray-600 font-mono">
                                        #{externalReference}
                                    </span>
                                </div>
                            )}
                            {paymentId && paymentId !== "null" && (
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700">
                                        Comprobante (Mercado Pago):
                                    </span>
                                    <span className="text-gray-600 font-mono">
                                        {paymentId}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        {status === "failure" && (
                            <button
                                onClick={() => navigate("/carrito")}
                                className="flex-1 py-3 px-4 bg-[#2f3027] text-white font-bold rounded-xl hover:bg-black transition shadow-sm cursor-pointer"
                            >
                                Volver a intentar
                            </button>
                        )}
                        <button
                            onClick={() => navigate("/")}
                            className={`flex-1 py-3 px-4 font-bold rounded-xl transition shadow-sm cursor-pointer ${
                                status === "failure"
                                    ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    : "bg-[#16a34a] text-white hover:bg-[#15803d]"
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
