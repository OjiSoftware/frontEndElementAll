import DashboardLayout from "@/layouts/DashboardLayout";
import { useSaleForm } from "@/hooks/useSaleForm";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import ProductSelector from "@/components/ProductsSelector";
import { saleApi } from "@/services/SaleService";
import { clientApi } from "@/services/ClientService";


export default function CreateSalePage() {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const {
        formData,
        setFormData,
        products,
        addProductToSale,
        handleChange,
        isLoading
    } = useSaleForm();

    // Función para eliminar un producto de la lista actual
    const removeItem = (productId: number) => {
        const itemToRemove = formData.details.find(d => d.productId === productId);
        if (!itemToRemove) return;

        const newTotal = formData.total - (itemToRemove.price * itemToRemove.quantity);
        setFormData({
            ...formData,
            details: formData.details.filter(d => d.productId !== productId),
            total: Number(newTotal.toFixed(2))
        });
    };

    const handleConfirmSubmit = async () => {
        try {
            if (formData.name === "" || formData.surname === "" || formData.dni === "" || formData.phoneNumber === "" || formData.email === "") {
                alert("Por favor, completa todos los datos del cliente.");
                return;
            };

            // Validar formato del DNI (7 a 8 dígitos numéricos)
            const dniRegex = /^\d{7,8}$/;
            if (!dniRegex.test(formData.dni)) {
                alert("El DNI debe tener entre 7 y 8 números sin puntos.");
                return;
            };

            // Validar formato del Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Por favor, ingresa un correo electrónico válido.");
                return;
            };

            if (formData.details.length === 0) {
                alert("Por favor, agrega al menos un producto a la venta.");
                return;
            };
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
            };
            const clientResponse = await clientApi.create(clientPayload);
            const newClientId = clientResponse.id || clientResponse.client?.id;

            // 2. Crear la venta con el ID del cliente generado
            const payload = {
                clientId: newClientId,
                status: formData.status,
                details: formData.details.map(d => ({
                    productId: d.productId,
                    quantity: d.quantity
                }))
            };

            await saleApi.create(payload);

            console.log("Venta procesada con éxito:", payload);
            setShowConfirmModal(false);
            navigate("/management/sales");
        } catch (error) {
            console.error("Error al crear la venta o el cliente", error);
            alert("Hubo un error al registrar la venta. Verifica que los datos del cliente no estén duplicados o incompletos.");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-1 xl:px-0">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-1 cursor-pointer"
                >
                    ← Volver
                </button>

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <ShoppingCart className="text-indigo-400" size={32} />
                            Nueva Venta
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Ingresa los datos del cliente, selecciona los productos y confirma el total para registrar la operación.
                        </p>
                    </div>

                    {/* Selector de Estado */}
                    <div className="min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-200 mb-1">Estado de la Venta</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer"
                        >
                            <option value="PENDING">Pendiente</option>
                            <option value="IN_PROGRESS">En Progreso</option>
                            <option value="COMPLETED">Completada</option>
                            <option value="CANCELLED">Cancelada</option>
                        </select>
                    </div>
                </div>

                {/* Card Principal */}
                <div className="bg-slate-800/80 border border-white/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                    <div className="space-y-8">

                        {/* Datos del Cliente */}
                        <div className="pb-6 border-b border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">Datos del Cliente</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Nombre</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="Nombre" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Apellido</label>
                                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} required className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="Apellido" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">DNI</label>
                                    <input type="text" name="dni" value={formData.dni} onChange={handleChange} required className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="DNI" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Teléfono</label>
                                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="Teléfono" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Correo Electrónico</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="Correo Electrónico" />
                                </div>
                            </div>
                        </div>

                        {/* Selector de Productos */}
                        <div className="pb-6 border-b border-white/10">
                            <ProductSelector
                                products={products}
                                onProductSelect={addProductToSale}
                            />
                        </div>

                        {/* Tabla de Items */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-300">
                                <thead className="text-xs uppercase bg-slate-700/50 text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3">Producto</th>
                                        <th className="px-4 py-3 text-center">Cant.</th>
                                        <th className="px-4 py-3 text-right">Precio</th>
                                        <th className="px-4 py-3 text-right">Subtotal</th>
                                        <th className="px-4 py-3 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {formData.details.map((item) => (
                                        <tr key={item.productId} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-4 font-medium text-white">{item.name}</td>
                                            <td className="px-4 py-4 text-center">{item.quantity}</td>
                                            <td className="px-4 py-4 text-right">${item.price.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-right font-bold text-indigo-300">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-red-400 hover:text-red-300 p-1"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {formData.details.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500 italic">
                                                No hay productos añadidos aún
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Resumen Final */}
                        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/20 gap-4">
                            <div className="text-2xl font-bold text-white">
                                Total: <span className="text-green-400">${formData.total}</span>
                            </div>

                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => navigate("/management/sales")}
                                    className="flex-1 md:flex-none px-6 py-3 rounded-lg border border-gray-500 text-gray-300 hover:bg-slate-700 transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    disabled={formData.details.length === 0}
                                    className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Finalizar Venta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Confirmación de Venta */}
                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Confirmar Venta"
                    message={
                        <div className="text-slate-300">
                            ¿Estás seguro de registrar esta venta por un total de
                            <b className="text-white ml-1 font-bold">${formData.total}</b>?
                        </div>
                    }
                    isLoading={false}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmSubmit}
                    confirmText="Confirmar"
                    cancelText="Revisar"
                />
            </div>
        </DashboardLayout>
    );
}