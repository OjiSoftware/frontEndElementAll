import React, { useState } from "react";
import { CartItem, useCart } from "@/context/CartContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

interface CartRowProps {
    item: CartItem;
}

const CartRow: React.FC<CartRowProps> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const [isExpanded, setIsExpanded] = useState(false);

    // Default image if product has no imageUrl
    const imageUrl = item.product.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

    return (
        <div className="p-4 bg-white hover:bg-gray-50 transition-colors font-lato border-b border-gray-100 last:border-b-0 relative">
            <div className="flex flex-col sm:grid sm:grid-cols-[4fr_1.5fr_1.2fr_1.5fr_24px] gap-4 sm:items-center">

                {/* Column 1: Image, Title, Actions (Mobile: Header format) */}
                <div className="flex items-center gap-3 w-full pr-6 sm:pr-0">
                    {/* Conditionally show Image */}
                    {isExpanded && (
                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center p-1 border border-gray-200 rounded">
                            <img
                                src={imageUrl}
                                alt={item.product.name}
                                className="max-w-full max-h-full object-contain mix-blend-multiply"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-0.5 justify-center">
                        <div className="flex flex-wrap items-center gap-x-3">
                            <h3 className="text-[#3b4b5e] text-[15px] sm:text-sm font-bold hover:underline cursor-pointer">
                                {item.product.name}
                            </h3>
                            {/* Desktop Delete Button (Hidden on Mobile) */}
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="hidden sm:flex text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition items-center justify-center"
                                title="Eliminar producto"
                            >
                                <TrashIcon className="w-5 h-5 sm:w-4 sm:h-4 stroke-2" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ======================= */}
                {/* DESKTOP VIEW (sm and up) */}
                {/* ======================= */}

                {/* Column 2: Unit Price (Desktop) */}
                <div className="hidden sm:flex flex-col text-center justify-center h-full w-full sm:w-auto">
                    <span className="text-[#3b4b5e] font-bold text-[15px]">
                        $ {Number(item.product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                {/* Column 3: Quantity Control (Desktop) */}
                <div className="hidden sm:flex flex-col items-center justify-center">
                    <div className="flex items-center bg-white border border-gray-200 rounded overflow-hidden h-9 sm:h-8 shadow-sm">
                        <button
                            className="px-3 sm:px-2 lg:px-3 hover:bg-gray-100 h-full text-sm cursor-pointer text-gray-700 font-bold transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val > 0) {
                                    updateQuantity(item.product.id, val);
                                }
                            }}
                            onBlur={(e) => {
                                const val = parseInt(e.target.value);
                                if (isNaN(val) || val <= 0) {
                                    updateQuantity(item.product.id, 1);
                                }
                            }}
                            className="w-10 h-full text-center text-[15px] font-bold bg-transparent border-none focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none p-0 text-[#3b4b5e]"
                            min="1"
                        />
                        <button
                            className="px-3 sm:px-2 lg:px-3 hover:bg-gray-100 h-full text-sm cursor-pointer text-gray-700 font-bold transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Column 4: Total Price (Desktop) */}
                <div className="hidden sm:flex flex-col text-center justify-center h-full w-full sm:w-auto">
                    <div className="text-[#2f3027] font-bold font-lato text-[15px] lg:text-base whitespace-nowrap">
                        $ {(item.product.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </div>
                </div>


                {/* ======================= */}
                {/* MOBILE VIEW (< sm) */}
                {/* ======================= */}

                {/* Content collapse area (Mobile) */}
                <div className={`${isExpanded ? 'flex' : 'hidden'} sm:hidden flex-col gap-4 w-full mt-2 items-center`}>

                    {/* Unit Price (Mobile) */}
                    <div className="flex flex-col text-center justify-center w-full">
                        <span className="text-gray-400 text-xs mb-1 uppercase font-bold tracking-wider">Precio Unitario</span>
                        <span className="text-[#3b4b5e] font-bold text-[15px]">
                            $ {Number(item.product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Quantity Control (Mobile) */}
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-gray-400 text-xs mb-1 uppercase font-bold tracking-wider">Cantidad</span>
                        <div className="flex items-center bg-white border border-gray-200 rounded overflow-hidden h-9 shadow-sm">
                            <button
                                className="px-3 hover:bg-gray-100 h-full text-sm cursor-pointer text-gray-700 font-bold transition-colors"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val > 0) {
                                        updateQuantity(item.product.id, val);
                                    }
                                }}
                                onBlur={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (isNaN(val) || val <= 0) {
                                        updateQuantity(item.product.id, 1);
                                    }
                                }}
                                className="w-10 h-full text-center text-[15px] font-bold bg-transparent border-none focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none p-0 text-[#3b4b5e]"
                                min="1"
                            />
                            <button
                                className="px-3 hover:bg-gray-100 h-full text-sm cursor-pointer text-gray-700 font-bold transition-colors"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Total Price & Delete Button (Mobile) */}
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3 w-full">
                        {/* Mobile Delete Button */}
                        <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition flex items-center justify-center gap-2 text-sm font-bold"
                            title="Eliminar producto"
                        >
                            <TrashIcon className="w-5 h-5 stroke-2" /> Eliminar
                        </button>

                        {/* Mobile Total */}
                        <div className="flex flex-col text-right justify-center">
                            <span className="text-gray-400 text-xs mb-1 uppercase font-bold tracking-wider">Subtotal</span>
                            <div className="text-[#2f3027] font-bold font-lato text-[17px] whitespace-nowrap">
                                $ {(item.product.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 5: Expand Toggle (Always top right on mobile, regular grid on desktop) */}
                <div className="absolute top-4 right-4 sm:static sm:flex sm:justify-end sm:items-center sm:h-full">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded"
                        title={isExpanded ? "Ocultar imagen" : "Ver imagen"}
                    >
                        {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartRow;
