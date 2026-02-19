import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useBrandEdit } from "@/hooks/useBrandEdit";
import { brandApi } from "@/services/BrandService";

export default function EditBrandPage() {
    const navigate = useNavigate();
    const {
        id,
        name,
        setName,
        subCategoryId,
        setSubCategoryId,
        loading,
        handleSubmit,
    } = useBrandEdit();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [subCategories, setSubCategories] = useState<
        { id: number; name: string }[]
    >([]);

    if (!id) return null;

    // Fetch de subcategorías
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const data = await brandApi.getSubCategories();
                setSubCategories(data);
            } catch (error) {
                console.error("Error cargando subcategorías:", error);
            }
        };
        fetchSubCategories();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto px-1 xl:px-0">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-1 cursor-pointer"
                >
                    ← Volver
                </button>

                <h1 className="text-3xl font-bold text-white mb-2">
                    Editar marca
                </h1>
                <p className="text-slate-400 mb-6">
                    Cambie el nombre y la subcategoría de la marca
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setShowConfirmModal(true);
                    }}
                    className="bg-slate-800/80 border border-white/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md grid gap-6"
                >
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Nombre de la marca
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingrese el nombre de la marca"
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Subcategoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Subcategoría
                        </label>
                        <select
                            value={subCategoryId}
                            onChange={(e) =>
                                setSubCategoryId(parseInt(e.target.value))
                            }
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            required
                        >
                            <option value="">
                                Seleccione una subcategoría
                            </option>
                            {subCategories.map((sc) => (
                                <option key={sc.id} value={sc.id}>
                                    {sc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-white/20">
                        <button
                            type="button"
                            onClick={() => navigate("/management/brands")}
                            className="px-5 py-3 rounded-lg border border-gray-400 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 transition cursor-pointer"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-3 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>

                <ConfirmModal
                    isOpen={showConfirmModal}
                    title="Guardar cambios"
                    message={
                        <>
                            ¿Seguro que querés guardar los cambios de{" "}
                            <b>{name}</b>?
                        </>
                    }
                    isLoading={loading}
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleSubmit}
                    confirmText="Guardar"
                    cancelText="Cancelar"
                />
            </div>
        </DashboardLayout>
    );
}
