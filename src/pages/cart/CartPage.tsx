import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CartTable from "@/components/CartTable";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CartPage() {
    const { cart, totalItems, totalPrice, clearCart } = useCart();
    const [search, setSearch] = useState("");

    if (cart.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Tu carrito está vacío
                </h2>
                <p>Agrega productos desde la tienda para comenzar.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
            {/* Navbar con búsqueda */}
            <div>
                <Navbar search={search} setSearch={setSearch} />
            </div>

            <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto py-8 flex-grow">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                    <h1 className="text-3xl font-bold mb-6">
                        Tu carrito de compras
                    </h1>

                    <CartTable cart={cart} />

                    <div className="mt-6 flex justify-between items-center">
                        <div>
                            <p className="text-lg font-semibold">
                                Total ({totalItems} items): $
                                {totalPrice.toFixed(2)}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={clearCart}
                            >
                                Vaciar carrito
                            </button>
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                Ir a pagar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
