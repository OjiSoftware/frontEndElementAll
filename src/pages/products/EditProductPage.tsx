import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Brand } from "@/types/brand.types";
import { Category } from "@/types/category.types";
import { SubCategory } from "@/types/subcategory.types";
import { productApi } from "@/services/ProductService";
import toast from "react-hot-toast";
import { useProductEdit } from "@/hooks/useProductEdit";
import { SquarePen } from "lucide-react";

export default function EditProductPage() {
    const navigate = useNavigate();
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

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    if (!id)
        return (
            <div>
                <h1>Producto no encontrado</h1>
                <button
                    onClick={() => navigate("/management")}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                >
                    Volver
                </button>
            </div>
        );

    // ---------------- Handlers ----------------
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prev) => ({ ...prev, [name]: checked }));
            return;
        }

        const isNumeric = ["brandId", "categoryId", "subCategoryId", "price"].includes(name);
        let finalValue: string | number = isNumeric ? parseFloat(value) || 0 : value;
        if (name === "price") finalValue = Math.max(0, finalValue as number);

        setFormData((prev) => {
            const newState = { ...prev, [name]: finalValue };
            if (name === "categoryId" && prev.categoryId !== finalValue) {
                newState.subCategoryId = 0;
            }
            return newState;
        });
    };

    const handleSubmit = async () => {
        setShowConfirmModal(false);
        const loadingToast = toast.loading("Guardando producto...");
        <input
            type="text"
            name="price"
            value={priceInput}
            onChange={(e) => {
                const raw = e.target.value;
                setPriceInput(raw);

                const numericValue = parseFloat(
                    raw.replace(/\./g, "").replace(",", "."),
                );
                setFormData((prev) => ({
                    ...prev,
                    price: isNaN(numericValue) ? 0 : Math.max(0, numericValue),
                }));
            }}
            onBlur={() =>
                setPriceInput(
                    formData.price.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                    }),
                )
            }
            placeholder="0,00"
            required
            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
        />;
        try {
            await productApi.update(id!, {
                name: formData.name,
                description: formData.description,
                price: Math.max(0, formData.price),
                imageUrl: formData.imageUrl,
                brandId: formData.brandId,
                subCategoryId: formData.subCategoryId,
                showingInCatalog: formData.showingInCatalog,
            });

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

    const filteredSubCategories: SubCategory[] = subCategories.filter(
        (sub) => sub.categoryId === formData.categoryId,
    );

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto px-1 xl:px-0">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-1 cursor-pointer"
                >
                    ← Volver
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <SquarePen className="text-indigo-400" size={32} />
                        Editar producto
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Complete la información para editar el producto.
                    </p>
                </div>

                {/* Card de producto */}
                <div className="flex items-center gap-6 mb-8 bg-slate-800/30 p-6 rounded-2xl border border-white/20 shadow-lg">
                    <div className="w-28 h-28 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 p-0.5">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-slate-700">
                            <img
                                src={formData.imageUrl}
                                alt={formData.name}
                                title={formData.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {formData.name || "Sin nombre"}
                        </h2>
                        <p className="text-indigo-400 font-medium">
                            ID del Producto: #{id}
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <div className="bg-slate-800/80 border border-white/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowConfirmModal(true);
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Nombre del producto */}
                        <div className="md:col-span-2">
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

                        {/* Marca */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Marca
                            </label>
                            <select
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                                required
                            >
                                <option value={0}>Seleccione una marca</option>
                                {brands.map((b: Brand) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
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
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    setPriceInput(raw);

                                    const numericValue = parseFloat(
                                        raw
                                            .replace(/\./g, "")
                                            .replace(",", "."),
                                    );
                                    setFormData((prev) => ({
                                        ...prev,
                                        price: isNaN(numericValue)
                                            ? 0
                                            : Math.max(0, numericValue),
                                    }));
                                }}
                                onBlur={() =>
                                    setPriceInput(
                                        formData.price.toLocaleString("es-AR", {
                                            minimumFractionDigits: 2,
                                        }),
                                    )
                                }
                                placeholder="0,00"
                                required
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Categoría
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value={0}>
                                    Seleccione una categoría
                                </option>
                                {categories.map((c: Category) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subcategoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Subcategoría
                            </label>
                            <select
                                name="subCategoryId"
                                value={formData.subCategoryId}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value={0}>
                                    Seleccione una subcategoría
                                </option>
                                {filteredSubCategories.map(
                                    (sub: SubCategory) => (
                                        <option key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Checkbox de Catálogo */}
                        <div className="md:col-span-2 flex items-center gap-3 bg-slate-700/50 p-3 rounded-xl border border-gray-600">
                            <input
                                type="checkbox"
                                id="showingInCatalog"
                                name="showingInCatalog"
                                checked={formData.showingInCatalog}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-500 text-indigo-500 focus:ring-indigo-400 bg-slate-800 cursor-pointer"
                            />
                            <label htmlFor="showingInCatalog" className="text-sm font-medium text-white cursor-pointer select-none">
                                Mostrar en catálogo
                            </label>
                        </div>

                        {/* Botones */}
                        <div className="md:col-span-2 flex items-center justify-end gap-4 mt-6 pt-6 border-t border-white/20">
                            <button
                                type="button"
                                onClick={() => navigate("/management/products")}
                                className="px-5 py-3 rounded-lg border border-gray-400 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-5 py-3 rounded-lg bg-indigo-500 text-white font-bold hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal */}
                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Guardar cambios"
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
