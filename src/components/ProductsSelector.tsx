import React, { useState, useRef, useEffect } from "react";
import { Product } from "../types/product.types";
import { Search, ChevronDown, X, Plus } from "lucide-react";

interface ProductSelectorProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
    products,
    onProductSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar el buscador si el usuario hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtrar productos basados en el término de búsqueda
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleSelect = (product: Product) => {
        // CORRECCIÓN 1: Aseguramos que el stock no sea undefined con ?? 0
        const stockActual = product.stock ?? 0;
        if (stockActual <= 0) return;

        onProductSelect(product);
        setSearchTerm("");
        setIsOpen(false);
    };

    return (
        <div className="w-full mb-4 relative" ref={containerRef}>
            <label className="block text-sm font-medium text-gray-200 mb-2">
                Buscar Producto
            </label>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-400">
                    <Search size={18} />
                </div>

                <input
                    type="text"
                    placeholder="Escribe el nombre del producto..."
                    value={searchTerm}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    className="block w-full bg-slate-700/90 border border-gray-500 rounded-xl pl-10 pr-10 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="text-gray-400 hover:text-white cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <ChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            {/* Dropdown con Tabla de Stock */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-center text-gray-300 text-sm">
                            {" "}
                            {/* text-center aquí ayuda mucho */}
                            <thead className="text-xs uppercase bg-slate-700/80 text-slate-400 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-left w-12">
                                        ID
                                    </th>{" "}
                                    <th className="px-4 py-2 text-left">
                                        Producto
                                    </th>{" "}
                                    <th className="px-4 py-2 text-center">
                                        Stock
                                    </th>
                                    <th className="px-4 py-2 text-center">
                                        Precio
                                    </th>{" "}
                                    <th className="px-4 py-2 text-center w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => {
                                        const stockActual = product.stock ?? 0;
                                        const isOutOfStock = stockActual <= 0;

                                        return (
                                            <tr
                                                key={product.id}
                                                onClick={() =>
                                                    !isOutOfStock &&
                                                    handleSelect(product)
                                                }
                                                className={`transition-colors ${
                                                    isOutOfStock
                                                        ? "opacity-40 cursor-not-allowed bg-slate-900/50"
                                                        : "hover:bg-indigo-600/30 cursor-pointer"
                                                }`}
                                            >
                                                <td className="px-4 py-3 text-left text-gray-500 font-mono text-xs">
                                                    {product.id}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 text-left font-medium ${isOutOfStock ? "text-gray-500" : "text-white"}`}
                                                >
                                                    {product.name}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {isOutOfStock ? (
                                                        <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30 uppercase">
                                                            Sin stock
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">
                                                            {stockActual} un.
                                                        </span>
                                                    )}
                                                </td>
                                                {/* PRECIO CENTRADO */}
                                                <td
                                                    className={`px-4 py-3 text-center ${isOutOfStock ? "line-through text-gray-600" : "text-gray-300"}`}
                                                >
                                                    {Number(
                                                        product.price,
                                                    ).toLocaleString("es-AR", {
                                                        style: "currency",
                                                        currency: "ARS",
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        disabled={isOutOfStock}
                                                        className={`p-1.5 rounded-lg flex items-center justify-center ${
                                                            isOutOfStock
                                                                ? "text-gray-700"
                                                                : "text-indigo-400 hover:text-white"
                                                        }`}
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-gray-400"
                                        >
                                            No se encontraron productos
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSelector;
