import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { PackagePlus } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { useCreateBrand } from "@/hooks/useBrandForm";

export default function CreateBrandPage() {
    const {
        formData,
        categories,
        filteredSubCategories,
        isLoading,
        handleChange,
        handleSubmit: submitBrand,
    } = useCreateBrand();

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleSubmit = async () => {
        setShowConfirmModal(false);
        const loadingToast = toast.loading("Creando marca...");
        try {
            await submitBrand();
            toast.success("¡Marca creada con éxito!", { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al crear la marca.", {
                id: loadingToast,
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto px-4 h-full flex flex-col justify-center">
                {/* Volver y header */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <button
                            onClick={() => window.history.back()}
                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer mb-2"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <PackagePlus
                                className="text-indigo-400"
                                size={24}
                            />
                            Nueva marca
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm hidden md:block">
                        Complete la información para crear una nueva marca.
                    </p>
                </div>

                {/* Card de preview sin imagen */}
                <div className="flex items-center gap-4 mb-4 bg-slate-800/30 p-3 rounded-xl border border-white/10 shadow-lg">
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">
                            {formData.name || "Nueva marca"}
                        </h2>
                        <p className="text-indigo-400 text-xs font-medium">
                            ID: Nuevo
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!formData.name.trim())
                            return toast.error("El nombre es obligatorio");
                        if (!formData.categoryId || !formData.subCategoryId)
                            return toast.error(
                                "Selecciona Categoría y Subcategoría",
                            );
                        setShowConfirmModal(true);
                    }}
                    className="bg-slate-800/80 border border-white/20 p-6 rounded-2xl shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
                >
                    {/* Columna izquierda: Información básica */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1.5">
                            Información básica
                        </h3>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Nombre de la marca
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Samsung"
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Columna derecha: Categorías */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-indigo-400 text-sm font-semibold border-b border-white/10 pb-1.5">
                            Categorización
                        </h3>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Categoría
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Subcategoría
                            </label>
                            <select
                                name="subCategoryId"
                                value={formData.subCategoryId || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {filteredSubCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex-1 px-4 py-3 text-sm font-bold rounded-lg border border-slate-500 text-white bg-transparent transition-all duration-300 cursor-pointer hover:bg-red-600 hover:border-red-600"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 text-sm font-bold rounded-lg bg-indigo-600 text-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                            >
                                {isLoading ? "Creando..." : "Crear marca"}
                            </button>
                        </div>
                    </div>
                </form>

                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Crear marca"
                    message={
                        <>
                            ¿Seguro que querés crear la marca{" "}
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
