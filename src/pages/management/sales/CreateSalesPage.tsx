import DashboardLayout from "@/layouts/DashboardLayout";
import { useSaleForm } from "@/hooks/useSaleForm";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useState } from "react";
import {
    ShoppingCart,
    ChevronDown,
    ChevronUp,
    UserPlus,
} from "lucide-react";
import { TrashIcon } from "@heroicons/react/20/solid";
import ProductSelector from "@/components/ProductsSelector";
import { saleApi } from "@/services/SaleService";
import { clientApi } from "@/services/ClientService";

export default function CreateSalePage() {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isClientOpen, setIsClientOpen] = useState(true);

    const {
        formData,
        setFormData,
        products,
        addProductToSale,
        updateProductQuantity,
        handleChange,
        isLoading,
    } = useSaleForm();

    // Función para eliminar un producto de la lista actual
    const removeItem = (productId: number) => {
        const itemToRemove = formData.details.find(
            (d) => d.productId === productId,
        );
        if (!itemToRemove) return;

        const newTotal =
            formData.total - itemToRemove.price * itemToRemove.quantity;
        setFormData({
            ...formData,
            details: formData.details.filter((d) => d.productId !== productId),
            total: Number(newTotal.toFixed(2)),
        });
    };

    const handleConfirmSubmit = async () => {
        try {
            if (
                formData.name === "" ||
                formData.surname === "" ||
                formData.dni === "" ||
                formData.phoneNumber === "" ||
                formData.email === ""
            ) {
                alert("Por favor, completa todos los datos del cliente.");
                return;
            }

            // Validar formato del DNI (7 a 8 dígitos numéricos)
            const dniRegex = /^\d{7,8}$/;
            if (!dniRegex.test(formData.dni)) {
                alert("El DNI debe tener entre 7 y 8 números sin puntos.");
                return;
            }

            // Validar formato del Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Por favor, ingresa un correo electrónico válido.");
                return;
            }

            if (formData.details.length === 0) {
                alert("Por favor, agrega al menos un producto a la venta.");
                return;
            }
            if (formData.status === "") {
                alert("Por favor, selecciona un estado para la venta.");
                return;
            }
            // 1. Crear el cliente
            const clientPayload = {
                name: formData.name,
                surname: formData.surname,
                dni: formData.dni,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
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
            const clientResponse = await clientApi.create(clientPayload);
            const newClientId = clientResponse.id || clientResponse.client?.id;

            // 2. Crear la venta con el ID del cliente generado
            const payload = {
                clientId: newClientId,
                status: formData.status,
                details: formData.details.map((d) => ({
                    productId: d.productId,
                    quantity: d.quantity,
                })),
            };

            await saleApi.create(payload);

            console.log("Venta procesada con éxito:", payload);
            setShowConfirmModal(false);
            navigate("/management/sales");
        } catch (error) {
            console.error("Error al crear la venta o el cliente", error);
            alert(
                "Hubo un error al registrar la venta. Verifica que los datos del cliente no estén duplicados o incompletos.",
            );
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-center">
                <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-end mb-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 mb-1 flex items-center gap-1 cursor-pointer"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ShoppingCart
                                className="text-indigo-400"
                                size={24}
                            />
                            Nueva venta
                        </h1>
                    </div>

                    {/* Selector de Estado */}
                    <div className="flex flex-col items-start md:items-end">
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                            Estado
                        </label>

                        {/* Selector de Estado (único) */}
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="
                            bg-slate-700/90 border border-gray-500 rounded-lg
                              px-3 py-2 text-sm text-white
                              focus:ring-2 focus:ring-indigo-400 outline-none
                              cursor-pointer
                              w-full md:w-auto
                              md:min-w-[160px]
                            "
                        >
                            <option value="PENDING">Pendiente</option>
                            <option value="IN_PROGRESS">En progreso</option>
                            <option value="COMPLETED">Completada</option>
                            <option value="CANCELLED">Cancelada</option>
                        </select>
                    </div>
                </div>

                {/* Card Principal */}
                <div className="bg-slate-800/80 border border-white/20 p-4 md:p-6 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-6">
                    {/* Datos del Cliente Desplegable */}
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-800/50">
                        <button
                            type="button"
                            onClick={() => setIsClientOpen(!isClientOpen)}
                            className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <UserPlus
                                    className="text-indigo-400"
                                    size={20}
                                />
                                <h2 className="text-sm md:text-base font-semibold text-white">
                                    Datos del cliente y facturación
                                </h2>
                            </div>
                            {isClientOpen ? (
                                <ChevronUp
                                    className="text-gray-400"
                                    size={20}
                                />
                            ) : (
                                <ChevronDown
                                    className="text-gray-400"
                                    size={20}
                                />
                            )}
                        </button>

                        {isClientOpen && (
                            <div className="p-4 border-t border-white/5 space-y-4 shadow-inner">
                                <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1">
                                    Información personal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Ej: Juan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Ej: Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            DNI
                                        </label>
                                        <input
                                            type="text"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Sin puntos"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="+54 9 11..."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1 mt-6">
                                    Dirección de facturación
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Calle
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Ej: Av. Rivadavia"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Altura"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                                Piso
                                            </label>
                                            <input
                                                type="text"
                                                name="floor"
                                                value={formData.floor}
                                                onChange={handleChange}
                                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                                placeholder="Opcional"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                                Depto.
                                            </label>
                                            <input
                                                type="text"
                                                name="apartment"
                                                value={formData.apartment}
                                                onChange={handleChange}
                                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                                placeholder="Opcional"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Ciudad / Localidad
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Ciudad"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Provincia
                                        </label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Provincia"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Código Postal
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Ej: 1000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            País
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="País"
                                        />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Referencia
                                        </label>
                                        <input
                                            type="text"
                                            name="reference"
                                            value={formData.reference}
                                            onChange={handleChange}
                                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                            placeholder="Ej: Esquina con pared azul..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selector de Productos */}
                    <div>
                        <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1 mb-4">
                            Productos de la venta
                        </h3>
                        <ProductSelector
                            products={products}
                            onProductSelect={addProductToSale}
                        />
                    </div>

                    {/* MOBILE → Cards */}
                    <div className="md:hidden space-y-3">
                        {formData.details.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3"
                            >
                                {/* nombre */}
                                <div className="flex justify-between items-start">
                                    <div className="font-semibold text-white">
                                        {item.name}
                                    </div>

                                    <button
                                        title="Eliminar producto"
                                        className="text-red-500 hover:text-red-400 transition cursor-pointer"
                                        onClick={() =>
                                            removeItem(item.productId)
                                        }
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* cantidad */}
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">
                                        Cantidad
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateProductQuantity(
                                                item.productId,
                                                parseInt(e.target.value) || 1,
                                            )
                                        }
                                        className="w-20 bg-slate-700 border border-gray-500 rounded-lg px-2 py-1 text-sm text-white text-center"
                                    />
                                </div>

                                {/* precio */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Precio
                                    </span>
                                    <span className="text-gray-300">
                                        ${item.price.toLocaleString()}
                                    </span>
                                </div>

                                {/* subtotal */}
                                <div className="flex justify-between font-bold">
                                    <span className="text-slate-400">
                                        Subtotal
                                    </span>
                                    <span className="text-indigo-300">
                                        $
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {formData.details.length === 0 && (
                            <div className="text-center text-slate-500 italic py-6">
                                No hay productos añadidos aún
                            </div>
                        )}
                    </div>

                    {/* DESKTOP → Tabla */}
                    <div className="hidden md:block overflow-x-auto bg-slate-800/50 rounded-xl border border-white/10">
                        <table className="w-full text-left text-gray-300 text-sm">
                            <thead className="text-xs uppercase bg-slate-700/50 text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Producto</th>
                                    <th className="px-4 py-3 text-left">
                                        Cantidad
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Precio
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Subtotal
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Acción
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">
                                {formData.details.map((item) => (
                                    <tr key={item.productId}>
                                        <td className="px-4 py-3 font-medium text-white">
                                            {item.name}
                                        </td>

                                        <td className="px-4 py-3 text-left">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateProductQuantity(
                                                        item.productId,
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                    )
                                                }
                                                className="w-16 bg-slate-700 border border-gray-500 rounded-lg px-2 py-1 text-center text-white"
                                            />
                                        </td>

                                        <td className="px-4 py-3 text-left">
                                            ${item.price.toLocaleString()}
                                        </td>

                                        <td className="px-4 py-3 text-left font-bold text-indigo-300">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toLocaleString()}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <button
                                                title="Eliminar producto"
                                                className="text-red-500 hover:text-red-400 transition cursor-pointer"
                                                onClick={() =>
                                                    removeItem(item.productId)
                                                }
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Resumen Final y Botones */}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center pt-4 border-t border-white/10 gap-4">
                        <div className="text-xl font-bold text-white self-end md:self-auto">
                            {" "}
                            Total:{" "}
                            <span className="text-green-400">
                                ${formData.total}
                            </span>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={() => navigate("/management/sales")}
                                className="flex-1 md:flex-none md:min-w-35 px-4 py-3 text-sm font-bold rounded-lg border border-slate-500 text-white bg-transparent transition-all duration-300 cursor-pointer hover:bg-red-600 hover:border-red-600"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() => setShowConfirmModal(true)}
                                disabled={formData.details.length === 0}
                                className="flex-1 md:flex-none md:min-w-35 px-4 py-3 text-sm font-bold rounded-lg bg-indigo-600 text-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                            >
                                Finalizar venta
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Confirmación de Venta */}
                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Confirmar Venta"
                    message={
                        <div className="text-slate-300 text-sm">
                            ¿Estás seguro de registrar esta venta por un total
                            de
                            <b className="text-white ml-1 font-bold">
                                ${formData.total}
                            </b>
                            ?
                        </div>
                    }
                    isLoading={isLoading}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmSubmit}
                    confirmText="Confirmar"
                    cancelText="Revisar"
                />
            </div>
        </DashboardLayout>
    );
}
