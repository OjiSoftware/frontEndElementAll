import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product.types";
import { ROUTES } from "@/constants/routes";
// Lucide para info técnica
import { Package, Tag, Layers, Info, Box } from "lucide-react";
// Heroicons para mantener consistencia con la tabla
import { PencilIcon } from "@heroicons/react/20/solid";

interface ProductDetailsModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
}

export function ProductDetailsModal({
    isOpen,
    product,
    onClose,
}: ProductDetailsModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    const formatARS = (amount: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 border-t md:border border-slate-700 rounded-t-3xl md:rounded-xl p-4 md:p-6 w-full max-w-4xl shadow-2xl text-left transform transition-all animate-fade-in max-h-[95vh] md:max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-slate-700 pb-3 md:pb-4">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <Package className="text-indigo-400" size={20} />
                        Detalles{" "}
                        <span className="hidden md:inline">del producto</span>
                        <span className="tracking-wider">#{product.id}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition cursor-pointer text-2xl md:text-3xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Imagen */}
                        <div className="md:col-span-1 flex justify-center">
                            <div className="w-48 h-48 md:w-full md:h-auto md:aspect-square rounded-xl bg-slate-700/50 border border-slate-600 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                ) : (
                                    <Package
                                        size={48}
                                        className="text-slate-500 opacity-50"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Bloque de Información Principal */}
                        <div className="md:col-span-2">
                            <div className="bg-slate-700/30 p-4 md:p-5 rounded-lg border border-slate-600/50 h-full flex flex-col">
                                <div className="mb-2 md:mb-4">
                                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                                        {product.name}
                                    </h3>
                                </div>

                                {/* Descripción arriba del borde */}
                                <p className="text-xs md:text-sm text-gray-400 italic leading-relaxed mb-4">
                                    {product.description ||
                                        "Este producto no cuenta con una descripción detallada por el momento."}
                                </p>

                                {/* Borde y Precio abajo de la descripción */}
                                <div className="mt-auto pt-3 md:pt-4 border-t border-slate-600/50 inline-flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                        Precio de venta
                                    </span>
                                    <span className="text-2xl md:text-3xl font-black text-emerald-400">
                                        {formatARS(product.price || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grilla de Datos Técnicos */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {/* Categoría */}
                        <div className="bg-slate-700/30 p-3 md:p-4 rounded-lg border border-slate-600/50 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                            <div className="p-2 md:p-3 bg-indigo-500/10 rounded-lg text-indigo-400 w-fit">
                                <Layers size={18} className="md:w-5 md:h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] md:text-xs text-gray-400 uppercase block font-medium">
                                    Categoría
                                </span>
                                <span className="text-xs md:text-sm font-semibold text-gray-200">
                                    {product.subCategory?.category?.name ||
                                        "General"}
                                    <span className="text-gray-500 mx-1">
                                        /
                                    </span>
                                    {product.subCategory?.name || "Varios"}
                                </span>
                            </div>
                        </div>

                        {/* Marca */}
                        <div className="bg-slate-700/30 p-3 md:p-4 rounded-lg border border-slate-600/50 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                            <div className="p-2 md:p-3 bg-amber-500/10 rounded-lg text-amber-400 w-fit">
                                <Tag size={18} className="md:w-5 md:h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] md:text-xs text-gray-400 uppercase block font-medium">
                                    Marca
                                </span>
                                <span className="text-xs md:text-sm font-semibold text-gray-200">
                                    {product.brand?.name || "Sin Marca"}
                                </span>
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="bg-slate-700/30 p-3 md:p-4 rounded-lg border border-slate-600/50 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                            <div className="p-2 md:p-3 bg-emerald-500/10 rounded-lg text-emerald-400 w-fit">
                                <Info size={18} className="md:w-5 md:h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] md:text-xs text-gray-400 uppercase block font-medium">
                                    Stock
                                </span>
                                <span
                                    className={`text-xs md:text-sm font-bold ${product.stock === 0 ? "text-rose-400" : "text-gray-200"}`}
                                >
                                    {product.stock ?? 0} u.
                                </span>
                            </div>
                        </div>

                        {/* Presentación */}
                        <div className="bg-slate-700/30 p-3 md:p-4 rounded-lg border border-slate-600/50 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                            <div className="p-2 md:p-3 bg-slate-500/10 rounded-lg text-slate-400 w-fit">
                                <Box size={18} className="md:w-5 md:h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] md:text-xs text-gray-400 uppercase block font-medium">
                                    Unidad
                                </span>
                                <span className="text-xs md:text-sm font-semibold text-gray-200">
                                    {product.unit || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Banner de Catálogo */}
                    <div
                        className={`p-2 md:p-3 rounded-lg border flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold tracking-widest uppercase ${
                            product.showingInCatalog
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                : "bg-slate-700/50 border-slate-600 text-gray-400"
                        }`}
                    >
                        <div
                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${product.showingInCatalog ? "bg-emerald-400 animate-pulse" : "bg-gray-400"}`}
                        ></div>
                        {product.showingInCatalog
                            ? "Visible en Catálogo"
                            : "Oculto"}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 md:mt-8 flex justify-end border-t border-slate-700 pt-4 gap-2 md:gap-3">
                    <button
                        className="px-4 md:px-6 py-3 md:py-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition cursor-pointer text-xs md:text-sm flex-1 md:flex-none"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                    <Link
                        to={ROUTES.products.edit(product.id)}
                        className="px-4 md:px-6 py-3 md:py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-400 transition cursor-pointer text-xs md:text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 flex-1 md:flex-none"
                    >
                        <PencilIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        Editar
                    </Link>
                </div>
            </div>
        </div>
    );
}
