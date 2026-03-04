import DashboardLayout from "@/layouts/DashboardLayout";
import { useSaleEdit } from "@/hooks/useSaleEdit";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useState } from "react";
import { ShoppingCart, Trash2, ChevronDown, ChevronUp, UserPlus } from "lucide-react";
import ProductSelector from "@/components/ProductsSelector";
import { saleApi } from "@/services/SaleService";
import { clientApi } from "@/services/ClientService";


export default function EditSalesPage() {
  const { id } = useParams<{ id: string }>();
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
    clientId
  } = useSaleEdit(id);

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

      const dniRegex = /^\d{7,8}$/;
      if (!dniRegex.test(formData.dni)) {
        alert("El DNI debe tener entre 7 y 8 números sin puntos.");
        return;
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
      };

      if (formData.details.length === 0) {
        alert("Por favor, agrega al menos un producto a la venta.");
        return;
      };


      if (clientId) {
        const clientPayload = {
          name: formData.name,
          surname: formData.surname,
          dni: formData.dni,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          addresses: {
            street: formData.street,
            streetNum: parseInt(formData.number, 10) || 0,
            floor: formData.floor ? parseInt(formData.floor, 10) : undefined,
            apartment: formData.apartment || undefined,
            locality: formData.city,
            province: formData.province,
            reference: formData.reference || undefined,
          }
        };
        await clientApi.update(clientId, clientPayload);
      }


      const salePayload = {
        status: formData.status,
        details: formData.details.map(d => ({
          productId: d.productId,
          quantity: d.quantity
        }))
      };

      if (id) {
        await saleApi.update(id, salePayload);
      }

      setShowConfirmModal(false);
      navigate("/management/sales");
    } catch (error) {
      console.error("Error al actualizar la venta", error);
      alert("Hubo un error al actualizar la venta. Verifica los datos.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center text-white">
          Cargando los datos de la venta...
        </div>
      </DashboardLayout>
    );
  }

  return (
      <DashboardLayout>
          <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-center py-6">
              <div className="flex justify-between items-end mb-4">
                  <div>
                      <button
                          onClick={() => navigate(-1)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 mb-1 flex items-center gap-1 cursor-pointer"
                      >
                          ← Volver
                      </button>
                      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                          <ShoppingCart className="text-indigo-400" size={24} />
                          Editar Venta #{id}
                      </h1>
                  </div>

                  <div className="flex flex-col items-end">
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                          Estado de la Venta
                      </label>
                      <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer min-w-[150px]"
                      >
                          <option value="PENDING">Pendiente</option>
                          <option value="IN_PROGRESS">En Progreso</option>
                          <option value="COMPLETED">Completada</option>
                          <option value="CANCELLED">Cancelada</option>
                      </select>
                  </div>
              </div>

              <div className="bg-slate-800/80 border border-white/20 p-6 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-6">
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-800/50">
                      <button
                          type="button"
                          onClick={() => setIsClientOpen(!isClientOpen)}
                          className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                      >
                          <div className="flex items-center gap-2">
                              <UserPlus className="text-indigo-400" size={20} />
                              <h2 className="text-base font-semibold text-white">
                                  Datos del Cliente y Facturación
                              </h2>
                          </div>
                          {isClientOpen ? (
                              <ChevronUp className="text-gray-400" size={20} />
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
                                  Información Personal
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
                                          Correo Electrónico
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
                                  Dirección de Facturación
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
                                              placeholder="Opc."
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-medium text-gray-300 mb-1">
                                              Dpto.
                                          </label>
                                          <input
                                              type="text"
                                              name="apartment"
                                              value={formData.apartment}
                                              onChange={handleChange}
                                              className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                              placeholder="Opc."
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
                                          CP
                                      </label>
                                      <input
                                          type="text"
                                          name="postalCode"
                                          value={formData.postalCode}
                                          onChange={handleChange}
                                          className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                          placeholder="1000"
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

                  <div>
                      <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1 mb-4">
                          Productos de la Venta
                      </h3>
                      <ProductSelector
                          products={products}
                          onProductSelect={addProductToSale}
                      />
                  </div>

                  <div className="overflow-x-auto bg-slate-800/50 rounded-xl border border-white/10">
                      <table className="w-full text-left text-gray-300 text-sm">
                          <thead className="text-xs uppercase bg-slate-700/50 text-slate-400">
                              <tr>
                                  <th className="px-4 py-3">Producto</th>
                                  <th className="px-4 py-3 text-center">
                                      Cant.
                                  </th>
                                  <th className="px-4 py-3 text-right">
                                      Precio
                                  </th>
                                  <th className="px-4 py-3 text-right">
                                      Subtotal
                                  </th>
                                  <th className="px-4 py-3 text-center">
                                      Acción
                                  </th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {formData.details.map((item) => (
                                  <tr
                                      key={item.productId}
                                      className="hover:bg-white/5 transition-colors"
                                  >
                                      <td className="px-4 py-3 font-medium text-white">
                                          {item.name}
                                      </td>
                                      <td className="px-4 py-3 text-center">
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
                                              className="w-16 bg-slate-700/90 border border-gray-500 rounded-lg px-2 py-1 text-sm text-center text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                          />
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                          ${item.price.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-3 text-right font-bold text-indigo-300">
                                          $
                                          {(
                                              item.price * item.quantity
                                          ).toLocaleString()}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                          <button
                                              onClick={() =>
                                                  removeItem(item.productId)
                                              }
                                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer transition-colors"
                                          >
                                              <Trash2 size={16} />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                              {formData.details.length === 0 && (
                                  <tr>
                                      <td
                                          colSpan={5}
                                          className="px-4 py-8 text-center text-slate-500 italic"
                                      >
                                          No hay productos añadidos aún
                                      </td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-white/10 gap-4">
                      <div className="text-xl font-bold text-white">
                          Total:{" "}
                          <span className="text-green-400">
                              ${formData.total}
                          </span>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto">
                          <button
                              type="button"
                              onClick={() => navigate("/management/sales")}
                              className="flex-1 md:flex-none px-6 py-2 rounded-lg border border-slate-500 text-white hover:bg-slate-700 hover:text-white transition cursor-pointer text-sm"
                          >
                              Cancelar
                          </button>
                          <button
                              onClick={() => setShowConfirmModal(true)}
                              disabled={
                                  formData.details.length === 0 || isLoading
                              }
                              className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                          >
                              Guardar Cambios
                          </button>
                      </div>
                  </div>
              </div>

              <ConfirmModal
                  isOpen={showConfirmModal}
                  title="Actualizar Venta"
                  message={
                      <div className="text-slate-300 text-sm">
                          ¿Estás seguro de registrar estos cambios en la venta?
                          El total será de
                          <b className="text-white ml-1 font-bold">
                              ${formData.total}
                          </b>
                          .
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
