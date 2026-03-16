import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { productApi } from "@/services/ProductService";
import toast from "react-hot-toast";
import { useProductEdit } from "@/hooks/useProductEdit";
import { SquarePen, Image as ImageIcon } from "lucide-react";
import type { ProductEditBackend } from "@/types/product.types";

export default function EditProductPage() {
    const {
        id,
        formData,
        setFormData,
        priceInput,
        setPriceInput,
        categories,
        brands,
        subCategories,
        isLoading,
    } = useProductEdit();

    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const filteredSubCategories = subCategories.filter(
        (sub) => sub.categoryId === formData.categoryId,
    );

    if (!id)
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-full text-white">
                    <h1 className="text-2xl font-bold">
                        Producto no encontrado
                    </h1>
                    <button
                        onClick={() => navigate("/management/products")}
                        className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                    >
                        Volver
                    </button>
                </div>
            </DashboardLayout>
        );

    // ---------------- Handlers ----------------
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prev) => ({ ...prev, [name]: checked }));
            return;
        }

        const isNumeric = [
            "brandId",
            "categoryId",
            "subCategoryId",
            "stock",
        ].includes(name);
        const finalValue = isNumeric ? parseInt(value) || 0 : value;

        setFormData((prev) => {
            const newState = { ...prev, [name]: finalValue };
            if (name === "categoryId" && prev.categoryId !== finalValue) {
                newState.subCategoryId = 0;
            }
            return newState;
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setPriceInput(raw);

        const numericValue = parseFloat(
            raw.replace(/\./g, "").replace(",", "."),
        );
        setFormData((prev) => ({
            ...prev,
            price: isNaN(numericValue) ? 0 : Math.max(0, numericValue),
        }));
    };

    const handlePriceBlur = () => {
        setPriceInput(
            formData.price.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
            }),
        );
    };

    const handleSubmit = async () => {
        setShowConfirmModal(false);
        const loadingToast = toast.loading("Guardando cambios...");

        try {
            // Implementación de blindaje igual al Create
            const payload: ProductEditBackend = {
                brandId: formData.brandId,
                subCategoryId: formData.subCategoryId,
                name: formData.name.trim(),
                stock: Math.max(0, Math.floor(Number(formData.stock) || 0)),
                price: Math.max(0, formData.price),
                description: formData.description.trim(),
                showingInCatalog: formData.showingInCatalog,
                imageUrl: formData.imageUrl?.trim() || "",
                unit: formData.unit.trim(),
            };

            await productApi.update(id!, payload);

            toast.success("¡Producto actualizado con éxito!", {
                id: loadingToast,
            });
            navigate("/management/products");
        } catch (error) {
            console.error("Error al actualizar:", error);
            toast.error("Hubo un error al guardar los cambios.", {
                id: loadingToast,
            });
        }
    };

    const isFormInvalid =
        !formData.name.trim() ||
        !formData.unit.trim() ||
        !formData.description.trim() ||
        !formData.categoryId ||
        !formData.subCategoryId ||
        !formData.brandId ||
        formData.price <= 0 ||
        isLoading;

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-center">
                {/* Volver y Encabezado */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="mb-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                            >
                                ← Volver
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <SquarePen className="text-indigo-400" size={24} />
                            Editar producto
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm hidden md:block">
                        Modifique la información necesaria del producto.
                    </p>
                </div>

                {/* Card de preview */}
                <div className="flex items-center gap-4 mb-4 bg-slate-800/30 p-3 rounded-xl border border-white/10 shadow-lg">
                    <div className="w-16 h-16 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 p-0.5">
                        <div className="w-full h-full rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center">
                            {formData.imageUrl ? (
                                <img
                                    src={formData.imageUrl}
                                    alt={formData.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <ImageIcon
                                    className="text-slate-600"
                                    size={24}
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">
                            {formData.name || "Sin nombre"}
                        </h2>
                        <p className="text-indigo-400 text-xs font-medium">
                            ID: #{id}
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const {
                            categoryId,
                            subCategoryId,
                            brandId,
                            name,
                            unit,
                            price,
                        } = formData;

                        // Validaciones reforzadas (Igual que el Create)
                        if (!name.trim())
                            return toast.error("El nombre es obligatorio");
                        if (!unit.trim())
                            return toast.error(
                                "La unidad por bulto es obligatoria",
                            );
                        if (!categoryId)
                            return toast.error("Selecciona una Categoría");
                        if (!subCategoryId)
                            return toast.error("Selecciona una Subcategoría");
                        if (!brandId)
                            return toast.error("Selecciona una Marca");
                        if (price <= 0)
                            return toast.error("El precio debe ser mayor a 0");

                        setShowConfirmModal(true);
                    }}
                    className="bg-slate-800/80 border border-white/20 p-6 rounded-2xl shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
                >
                    {/* Columna izquierda */}
                    <div className="space-y-4">
                        <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1.5">
                            Información básica
                        </h3>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Nombre del producto{" "}
                                <span className="font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                autoComplete="off"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Teclado Mecánico RGB"
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Unidad por bulto{" "}
                                <span className="font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                name="unit"
                                autoComplete="off"
                                value={formData.unit}
                                onChange={handleChange}
                                placeholder="Ej: 24 unidades"
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Descripción <span className="font-bold">*</span>
                            </label>
                            <textarea
                                name="description"
                                maxLength={500}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Características..."
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all resize-none h-24 placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                URL de Imagen
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                autoComplete="off"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="Pegar URL"
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="flex flex-col mt-2 md:mt-0">
                        <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1.5 mb-4">
                            Categorización y precio
                        </h3>

                        <div className="space-y-4 grow">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                    Categoría{" "}
                                    <span className="font-bold">*</span>
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId || ""}
                                    onChange={handleChange}
                                    className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>
                                        Seleccionar...
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                        Subcategoría{" "}
                                        <span className="font-bold">*</span>
                                    </label>
                                    <select
                                        name="subCategoryId"
                                        value={formData.subCategoryId || ""}
                                        onChange={handleChange}
                                        className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>
                                            Seleccionar...
                                        </option>
                                        {filteredSubCategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                        Marca{" "}
                                        <span className="font-bold">*</span>
                                    </label>
                                    <select
                                        name="brandId"
                                        value={formData.brandId || ""}
                                        onChange={handleChange}
                                        className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>
                                            Seleccionar...
                                        </option>
                                        {brands.map((brand) => (
                                            <option
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                        Stock{" "}
                                        <span className="font-bold">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                        Precio ($){" "}
                                        <span className="font-bold">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        autoComplete="off"
                                        value={priceInput}
                                        onChange={handlePriceChange}
                                        onBlur={handlePriceBlur}
                                        placeholder="0,00"
                                        className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6 md:mt-8!">
                                <input
                                    type="checkbox"
                                    id="showInCatalog"
                                    name="showingInCatalog"
                                    checked={formData.showingInCatalog || false}
                                    onChange={handleChange}
                                    className="w-4 h-4 md:w-5! md:h-5! rounded border-gray-500 text-indigo-500 focus:ring-indigo-400 bg-slate-700 cursor-pointer"
                                />
                                <label
                                    htmlFor="showInCatalog"
                                    className="text-sm  text-slate-300 cursor-pointer"
                                >
                                    Mostrar en catálogo
                                </label>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col items-end w-full">
                            <div className="flex flex-row items-stretch gap-3 mt-6 md:mt-7! w-full border-t border-white/10 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/management/products")
                                    }
                                    className="flex-1 md:flex-none md:min-w-35 px-4 py-3 text-sm font-bold rounded-lg border border-slate-600 text-slate-300 bg-transparent transition-all duration-300 cursor-pointer hover:bg-slate-500/20 hover:text-white hover:border-slate-400"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={isFormInvalid}
                                    className={`flex-1 md:flex-none md:min-w-35 px-4 py-3 text-sm font-bold rounded-lg transition-all duration-300
                                      ${
                                          isFormInvalid
                                              ? "bg-emerald-600 text-white cursor-not-allowed opacity-50"
                                              : "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                      }`}
                                >
                                    Guardar cambios
                                </button>
                            </div>

                            <div className="relative h-6 w-full">
                                {" "}
                                {isFormInvalid && !isLoading && (
                                    <p className="absolute top-4 right-0 text-slate-500 text-[10px] text-right uppercase tracking-wide font-medium">
                                        * Complete todos los campos requeridos
                                        para guardar
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Guardar cambios"
                    variant="success"
                    message={
                        <>
                            ¿Seguro que querés guardar los cambios de{" "}
                            <b>{formData.name}</b>?
                        </>
                    }
                    isLoading={isLoading}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleSubmit}
                    confirmText="Guardar"
                    cancelText="Cancelar"
                />
            </div>
        </DashboardLayout>
    );
}
