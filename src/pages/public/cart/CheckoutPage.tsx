import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutButton from "@/components/CheckoutButton";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const [isDataConfirmed, setIsDataConfirmed] = useState(false);
    const [saleId, setSaleId] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        dni: "",
        phone: "",
        street: "",
        number: "",
        floor: "",
        apartment: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
        reference: "",
    });

    useEffect(() => {
        if (cart.length === 0 && !saleId) {
            navigate("/cart");
        }
    }, [cart, navigate, saleId]);

    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            alert(
                "El tiempo para completar la compra ha expirado. Por favor, verificá el stock e intentá de nuevo.",
            );
            window.location.reload(); // Reiniciar todo
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConfirmData = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDataConfirmed(true);
    };

    // 1. Congelamos la función para que no cambie de referencia
    const handleOrderCreated = useCallback((id: number) => {
        setSaleId(id);
        setTimeLeft(600); // Empezar contador de 10 minutos
    }, []);

    // 2. Congelamos los items del carrito
    const memoizedItems = useMemo(
        () =>
            cart.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
            })),
        [cart],
    );

    // 3. Congelamos los datos del cliente
    const memoizedClientData = useMemo(
        () => ({
            ...formData,
            addresses: {
                street: formData.street,
                streetNum: parseInt(formData.number, 10) || 0,
                floor: formData.floor
                    ? parseInt(formData.floor, 10)
                    : undefined,
                apartment: formData.apartment || undefined,
                locality: formData.city,
                province: formData.province,
                postalCode: formData.postalCode,
                country: formData.country,
                reference: formData.reference || undefined,
            },
        }),
        [formData],
    );

    if (cart.length === 0 && !saleId) return null;

    const isFormInvalid = useMemo(() => {
        return (
            !formData.name.trim() ||
            !formData.surname.trim() ||
            !formData.email.trim() ||
            !formData.dni.trim() ||
            !formData.phone.trim() ||
            !formData.street.trim() ||
            !formData.number.trim() ||
            !formData.city.trim() ||
            !formData.province.trim() ||
            !formData.postalCode.trim() ||
            !formData.country.trim()
        );
    }, [formData]);

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5] border-b border-gray-200">
            <Navbar search={search} setSearch={setSearch} />

            <div className="w-full max-w-[1187px] mx-auto py-6 flex-grow px-2 sm:px-4">
                <div className="mb-2">
                    <button
                        onClick={() => navigate("/cart")}
                        className="text-sm px-2 py-1 -ml-2 mb-3 font-medium text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Volver al carrito
                    </button>
                </div>

                <h1 className="text-[1.1rem] lg:text-[1.2rem] font-bold font-poppins text-[#2f3027] text-left leading-tight pb-4 px-1">
                    Finalizar compra
                </h1>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* IZQUIERDA: Formulario */}
                    <div className="flex-[0_0_100%] lg:flex-[0_0_68%] bg-white rounded-2xl max-sm:rounded-none shadow-sm border border-gray-200 max-sm:border-x-0 p-6 w-full">
                        {!isDataConfirmed ? (
                            <form
                                onSubmit={handleConfirmData}
                                className="flex flex-col gap-6 font-lato"
                            >
                                {/* SECCIÓN 1: Datos Personales */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-1 border-b border-gray-100 pb-2">
                                        Datos personales
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700">
                                                Nombre *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50
                                                placeholder:text-gray-400"
                                                placeholder="Ej: Juan"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700">
                                                Apellido *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="surname"
                                                value={formData.surname}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50
                                                placeholder:text-gray-400"
                                                placeholder="Ej: Pérez"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700">
                                                Email *
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="juan@correo.com"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700">
                                                DNI / CUIT *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="dni"
                                                value={formData.dni}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="Sin puntos"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                            <label className="text-sm font-bold text-gray-700">
                                                Teléfono *
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="Ej: 3512345678"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 2: Dirección de Envío/Facturación */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-1 border-b border-gray-100 pb-2">
                                        Dirección de envío
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                            <label className="text-sm font-bold text-gray-700">
                                                Calle *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="street"
                                                value={formData.street}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="Ej: Av. Rivadavia"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-bold text-gray-700">
                                                Número *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="number"
                                                value={formData.number}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="Altura"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm font-bold text-gray-700">
                                                    Piso
                                                </label>
                                                <input
                                                    type="text"
                                                    name="floor"
                                                    value={formData.floor}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                    placeholder="Opc."
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm font-bold text-gray-700">
                                                    Depto.
                                                </label>
                                                <input
                                                    type="text"
                                                    name="apartment"
                                                    value={formData.apartment}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                    placeholder="Opc."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                            <label className="text-sm font-bold text-gray-700">
                                                Ciudad / Localidad *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="Ciudad"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                            <label className="text-sm font-bold text-gray-700">
                                                Provincia *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="province"
                                                value={formData.province}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="Provincia"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 md:col-span-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm font-bold text-gray-700">
                                                    Código Postal *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                    placeholder="Ej: 5000"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm font-bold text-gray-700">
                                                    País *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                    placeholder="Ej: Argentina"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 md:col-span-4">
                                            <label className="text-sm font-bold text-gray-700">
                                                Referencia
                                            </label>
                                            <input
                                                type="text"
                                                name="reference"
                                                value={formData.reference}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] bg-gray-50 placeholder:text-gray-400"
                                                placeholder="Ej: Casa con rejas negras..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end w-full">
                                    <button
                                        type="submit"
                                        disabled={isFormInvalid}
                                        className={`w-full mt-4 py-3.5 text-[0.95rem] font-bold rounded-xl transition-all duration-300 flex justify-center items-center
                                            ${
                                                isFormInvalid
                                                    ? "bg-[#16a34a]/50 text-white/80 cursor-not-allowed"
                                                    : "bg-[#16a34a] text-white hover:bg-[#15803d] cursor-pointer shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.4)] active:scale-[0.98]"
                                            }`}
                                    >
                                        Confirmar datos
                                    </button>

                                    {/* Contenedor del mensaje para que no empuje el diseño */}
                                    <div className="h-5 relative w-full mt-2">
                                        {isFormInvalid && (
                                            <p className="absolute top-3 right-0 text-gray-400 text-[10px] text-right uppercase tracking-wide font-bold whitespace-nowrap">
                                                * Complete todos los campos
                                                requeridos para continuar
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4 animate-in fade-in duration-500">
                                <CheckCircleIcon
                                    className={`w-16 h-16 ${saleId ? "text-[#16a34a]" : "text-blue-500"} mb-4`}
                                />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {saleId
                                        ? "¡Stock reservado!"
                                        : "¡Datos confirmados!"}
                                </h2>
                                <p className="text-gray-500 text-center mb-8 max-w-sm">
                                    {saleId ? (
                                        <>
                                            Tu pedido{" "}
                                            <span className="font-bold text-gray-700">
                                                #{saleId}
                                            </span>{" "}
                                            ya está registrado y el stock
                                            reservado. Completá el pago antes de
                                            que expire el tiempo.
                                        </>
                                    ) : (
                                        "Hacé clic en el botón de abajo para verificar stock y proceder al pago seguro."
                                    )}
                                </p>

                                {timeLeft !== null && (
                                    <div className="mb-6 flex flex-col items-center">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                                            Reserva expira en
                                        </p>
                                        <div className="text-3xl font-mono font-black text-rose-500 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 shadow-inner">
                                            {formatTime(timeLeft)}
                                        </div>
                                    </div>
                                )}

                                <div className="w-full max-w-md">
                                    <CheckoutButton
                                        saleId={saleId}
                                        clientData={memoizedClientData}
                                        items={memoizedItems}
                                        total={totalPrice}
                                        onOrderCreated={handleOrderCreated}
                                    />
                                    {!saleId && (
                                        <button
                                            onClick={() =>
                                                setIsDataConfirmed(false)
                                            }
                                            className="w-full text-center text-sm text-gray-400 mt-4 hover:text-gray-600 transition underline underline-offset-4 cursor-pointer"
                                        >
                                            Editar mis datos
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DERECHA: Resumen de orden estático */}
                    <div className="flex-[0_0_100%] lg:flex-[1_1_30%] bg-white rounded-2xl max-sm:rounded-none shadow-sm border border-gray-200 max-sm:border-x-0 p-5 sticky top-8 flex flex-col gap-3 font-lato w-full">
                        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1">
                            Resumen de tu pedido
                        </h3>

                        <div className="flex flex-col gap-2 pb-3 border-b border-gray-100">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Subtotal ({totalItems} artículos)</span>
                                <span>
                                    $
                                    {totalPrice.toLocaleString("es-AR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 mb-2 mt-1">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-base">
                                    Total Final
                                </span>
                                <span className="font-black text-xl text-[#16a34a]">
                                    $
                                    {totalPrice.toLocaleString("es-AR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mt-2 border border-gray-100">
                            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                                Al confirmar tus datos, se generará una orden de
                                compra en nuestro sistema. El pago se procesa de
                                forma 100% segura a través de Mercado Pago.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
