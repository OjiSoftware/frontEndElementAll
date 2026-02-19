import DashboardLayout from "@/layouts/DashboardLayout";
import { useCreateBrand } from "@/hooks/useCreateBrand";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useState } from "react";
import { Tag } from "lucide-react";

export default function CreateBrandPage() {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const {
        formData,
        categories,
        filteredSubCategories,
        isLoading,
        handleChange,
        handleSubmit,
    } = useCreateBrand();

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto px-1 xl:px-0">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-1 cursor-pointer"
                >
                    ← Volver
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Tag className="text-indigo-400" size={32} />
                        Crear marca
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Complete la información para crear una nueva marca
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/80 border border-white/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowConfirmModal(true);
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Nombre de la marca
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Samsung"
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                                required
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
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer"
                                required
                            >
                                <option value={0}>Seleccione categoría</option>
                                {categories.map((c) => (
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
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer"
                                required
                            >
                                <option value={0}>
                                    Seleccione subcategoría
                                </option>
                                {filteredSubCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botones */}
                        <div className="md:col-span-2 flex justify-end gap-4 mt-6 pt-6 border-t border-white/20">
                            <button
                                type="button"
                                onClick={() => navigate("/management")}
                                className="px-5 py-3 rounded-lg border border-gray-400 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-5 py-3 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? "Creando..." : "Crear marca"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal confirm */}
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
