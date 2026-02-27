import React, { useState } from "react";
import type { Product } from "../types/product.types";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [productQuantity, setProductQuantity] = useState(1)


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(price);
    };

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await new Promise((res) => setTimeout(res, 1000));

            addToCart(product, productQuantity);

            toast.success(`${product.name} agregado al carrito 🛒`, {
                style: { backgroundColor: "#4caf50", color: "white" },
                duration: 2000,
            });


            setProductQuantity(1);

        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow duration-300 w-full max-w-60">
            {/* Imagen del Producto */}
            <div className="w-full h-40 flex items-center justify-center mb-4">
                <img
                    src={product.imageUrl || "https://via.placeholder.com/150"}
                    alt={product.name || "Nombre del producto"}
                    className="max-h-full object-contain"
                />
            </div>

            {/* Información */}
            <div className="grow">
                <h3 className="text-darker font-lato text-sm font-normal uppercase tracking-tight line-clamp-2 min-h-8">
                    {product.name}
                </h3>
                <p className="text-gray-400 font-lato text-xs mt-1 italic max-h-16 overflow-y-auto">
                    {product.description}
                </p>
                <p className="text-black font-lato font-bold text-lg mt-2">
                    {formatPrice(product.price)}
                </p>
            </div>

            {/* Botones para sumar y restar productos */}
            <div className="flex items-center justify-center gap-4 mb-2 mt-4">
                {/* Botón Menos */}
                <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                >
                    <span className="text-lg font-bold">-</span>
                </button>

                <span className="font-bold text-base w-6 text-center">{productQuantity}</span>

                {/* Botón Más */}
                <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => setProductQuantity(productQuantity + 1)}
                >
                    <span className="text-lg font-bold">+</span>
                </button>
            </div>

            {/* Botón Añadir al carrito */}
            <button
                className={`mt-4 relative ${isAdding
                    ? "bg-[#f9c72a]"
                    : "bg-[#4caf50] hover:bg-[#8bc34a]"
                    } text-white py-2 px-3 rounded flex items-center justify-center text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed overflow-hidden`}
                onClick={handleAddToCart}
                disabled={isAdding}
            >
                {/* Spinner: Solo aparece si isAdding es true, posicionado absolutamente al centro */}
                {isAdding && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                )}

                {/* Contenido original: Mantiene el ancho del botón incluso cargando */}
                <div
                    className={`flex items-center justify-center gap-2 ${isAdding ? "invisible" : "visible"}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span>Añadir al carrito</span>
                </div>
            </button>
        </div >
    );
};

export default ProductCard;
