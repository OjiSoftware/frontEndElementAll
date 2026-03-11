import { useState, useEffect } from "react";
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

    const [isCreatingSale, setIsCreatingSale] = useState(false);
    const [saleId, setSaleId] = useState<number | null>(null);

    // 🔥 ACTUALIZADO: Agregamos todos los campos del gestor
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

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    useEffect(() => {
        if (cart.length === 0 && !saleId) {
            navigate("/cart");
        }
    }, [cart, navigate, saleId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConfirmData = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingSale(true);

        try {
            const orderItems = cart.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
            }));

            // 🔥 ACTUALIZADO: Estructuramos el payload igual que en CreateSalePage
            const clientPayload = {
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
                    reference: formData.reference || undefined,
                },
            };

            const response = await fetch(`${API_URL}/sales/guest-checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientData: clientPayload,
                    items: orderItems,
                    total: totalPrice,
                }),
            });

            if (!response.ok) throw new Error("No se pudo registrar la orden.");

            const data = await response.json();

            if (data.saleId) {
                setSaleId(data.saleId);
            }
        } catch (error) {
            console.error("Error al crear la venta:", error);
            alert("Hubo un problema al guardar tus datos. Intentá de nuevo.");
        } finally {
            setIsCreatingSale(false);
        }
    };

    if (cart.length === 0 && !saleId) return null;

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5] border-b border-gray-200">
            <Navbar search={search} setSearch={setSearch} />

            <div className="w-full max-w-[1187px] mx-auto py-6 flex-grow px-2 sm:px-4">
                <div className="mb-2">
                    <button
                        onClick={() => navigate("/cart")}
                        className="text-sm font-medium text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Volver al carrito
                    </button>
                </div>

                <h1 className="text-[1.1rem] lg:text-[1.2rem] font-bold font-poppins text-[#2f3027] text-left leading-tight pb-4 px-1">
                    Finalizar Compra
                </h1>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* IZQUIERDA: Formulario */}
                    <div className="flex-[0_0_100%] lg:flex-[0_0_68%] bg-white rounded-2xl max-sm:rounded-none shadow-sm border border-gray-200 max-sm:border-x-0 p-6 w-full">
                        {!saleId ? (
                            <form
                                onSubmit={handleConfirmData}
                                className="flex flex-col gap-6 font-lato"
                            >
                                {/* SECCIÓN 1: Datos Personales */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-1 border-b border-gray-100 pb-2">
                                        Datos Personales
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
                                        Dirección de Envío
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
                                                    Depto
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

                                <button
                                    type="submit"
                                    disabled={isCreatingSale}
                                    className="w-full mt-4 py-3.5 bg-[#2f3027] text-white text-[0.95rem] font-bold rounded-xl hover:bg-black transition shadow-sm cursor-pointer disabled:opacity-50 flex justify-center items-center"
                                >
                                    {isCreatingSale ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            Registrando pedido...
                                        </span>
                                    ) : (
                                        "Confirmar Datos"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4 animate-in fade-in duration-500">
                                <CheckCircleIcon className="w-16 h-16 text-[#16a34a] mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    ¡Datos guardados!
                                </h2>
                                <p className="text-gray-500 text-center mb-8 max-w-sm">
                                    Tu pedido{" "}
                                    <span className="font-bold text-gray-700">
                                        #{saleId}
                                    </span>{" "}
                                    ya está registrado. Completá el pago para
                                    finalizar la compra.
                                </p>
                                <div className="w-full max-w-md">
                                    <CheckoutButton saleId={saleId} />
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
