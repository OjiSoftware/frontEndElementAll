import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { PackagePlus, Image as ImageIcon } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { useProductForm } from "@/hooks/useProductForm";

export default function CreateProductPage() {
    const {
        formData,
        setFormData,
        categories,
        brands,
        filteredSubCategories,
        handleChange,
        handleSubmit: submitFormData,
    } = useProductForm();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [priceInput, setPriceInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ---------------- Handlers ----------------
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setPriceInput(raw); // actualiza el input visible

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
        setIsLoading(true);
        const loadingToast = toast.loading("Creando producto...");

        try {
            await submitFormData(undefined, {
                ...formData,
                price: Math.max(0, formData.price),
                stock: formData.stock < 0 ? 0 : formData.stock,
            });

            toast.success("¡Producto creado con éxito!", { id: loadingToast });
            setPriceInput("");
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al crear el producto.", {
                id: loadingToast,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto px-1 xl:px-0">
                {/* Volver */}
                <button
                    onClick={() => window.history.back()}
                    className="text-sm text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-1 cursor-pointer"
                >
                    ← Volver
                </button>

                {/* Encabezado */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <PackagePlus className="text-indigo-400" size={32} />
                        Nuevo producto
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Complete la información para crear un nuevo producto.
                    </p>
                </div>

                {/* Card de preview */}
                <div className="flex items-center gap-6 mb-8 bg-slate-800/30 p-6 rounded-2xl border border-white/20 shadow-lg">
                    <div className="w-28 h-28 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 p-0.5">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center">
                            {formData.imageUrl ? (
                                <img
                                    src={formData.imageUrl}
                                    alt={formData.name}
                                    className="w-full h-full object-contain bg-slate-700"
                                />
                            ) : (
                                <ImageIcon
                                    className="text-slate-600"
                                    size={40}
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {formData.name || "Nuevo producto"}
                        </h2>
                        <p className="text-indigo-400 font-medium">ID: Nuevo</p>
                    </div>
                </div>

                {/* Formulario */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        const { categoryId, subCategoryId, brandId, price, name } = formData;

                        if (!name.trim()) {
                            return toast.error("El nombre es obligatorio");
                        }

                        if (!categoryId || !subCategoryId || !brandId) {
                            return toast.error("Debes seleccionar Categoría, Subcategoría y Marca");
                        }

                        if (price <= 0) {
                            return toast.error("El precio debe ser mayor a 0");
                        }

                        setShowConfirmModal(true);
                    }}

                    className="bg-slate-800/80 border border-white/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md grid grid-cols-1 gap-6"
                >
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Nombre del producto
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del producto"
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe las características principales..."
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all resize-none h-32"
                            required
                        />
                    </div>

                    {/* Categoría, Subcategoría, Marca */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Categoría
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                required
                            >
                                <option value={""}>Seleccionar...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Subcategoría
                            </label>
                            <select
                                name="subCategoryId"
                                value={formData.subCategoryId || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                required
                            >
                                <option value={""}>Seleccionar...</option>
                                {filteredSubCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Marca
                            </label>
                            <select
                                name="brandId"
                                value={formData.brandId || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                required
                            >
                                <option value={""}>Seleccionar...</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Stock
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min={0}
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />
                    </div>

                    {/* Unidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Unidad
                        </label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            placeholder="kg, unidad, etc..."
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Precio ($)
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={priceInput}
                            onChange={handlePriceChange}
                            onBlur={handlePriceBlur}
                            placeholder="0,00"
                            required
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                        />
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Imagen
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="Pegar URL de imagen..."
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
                        />
                        {formData.imageUrl && (
                            <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-700 mb-4">
                                <img
                                    src={formData.imageUrl}
                                    alt={formData.name}
                                    className="w-full h-full object-contain bg-slate-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-5 py-3 rounded-lg border border-gray-400 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-3 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creando..." : "Guardar producto"}
                        </button>
                    </div>
                </form>

                {/* Modal de confirmación */}
                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Crear producto"
                    message={
                        <>
                            ¿Seguro que querés crear el producto{" "}
                            <b>{formData.name}</b>?
                        </>
                    }
                    isLoading={isLoading}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleSubmit}
                    confirmText="Crear"
                    cancelText="Cancelar"
                />
            </div>
        </DashboardLayout>
    );
}
