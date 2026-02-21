import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useBrandEdit } from "@/hooks/useBrandEdit";
import { brandApi } from "@/services/BrandService";
import { SquarePen } from "lucide-react";

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
            <div className="max-w-3xl mx-auto px-4 h-full flex flex-col justify-center">
                {/* Volver y header */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer mb-2"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <SquarePen className="text-indigo-400" size={24} />
                            Editar marca
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm hidden md:block">
                        Modifique la información de la marca.
                    </p>
                </div>

                {/* Preview */}
                <div className="flex items-center gap-4 mb-4 bg-slate-800/30 p-3 rounded-xl border border-white/10 shadow-lg">
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">
                            {name || "Marca sin nombre"}
                        </h2>
                        <p className="text-indigo-400 text-xs font-medium">
                            ID: {id}
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setShowConfirmModal(true);
                    }}
                    className="bg-slate-800/80 border border-white/20 p-6 rounded-2xl shadow-2xl backdrop-blur-md grid grid-cols-1 gap-6"
                >
                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                            Nombre de la marca
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingrese el nombre de la marca"
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Subcategoría */}
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                            Subcategoría
                        </label>
                        <select
                            value={subCategoryId}
                            onChange={(e) =>
                                setSubCategoryId(parseInt(e.target.value))
                            }
                            className="w-full bg-slate-700/90 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                            required
                        >
                            <option value="">Seleccionar...</option>
                            {subCategories.map((sc) => (
                                <option key={sc.id} value={sc.id}>
                                    {sc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => navigate("/management/brands")}
                            className="flex-1 px-4 py-3 text-sm font-bold rounded-lg border border-slate-500 text-white bg-transparent transition-all duration-300 cursor-pointer hover:bg-red-600 hover:border-red-600"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 text-sm font-bold rounded-lg bg-indigo-600 text-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
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
