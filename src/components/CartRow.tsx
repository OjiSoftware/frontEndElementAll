import React from "react";
import { CartItem, useCart } from "@/context/CartContext";

interface CartRowProps {
    item: CartItem;
}

const CartRow: React.FC<CartRowProps> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <tr>
            <td className="p-2 border-b">{item.product.name}</td>
            <td className="p-2 border-b">${Number(item.product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            <td className="p-2 border-  b">
                <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                        updateQuantity(item.product.id, Number(e.target.value))
                    }
                    className="w-16 border rounded p-1 text-center"
                />
            </td>
            <td className="p-2 border-b">
                ${(item.product.price * item.quantity).toFixed(2)}
            </td>
            <td className="p-2 border-b">
                <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => removeFromCart(item.product.id)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
};

export default CartRow;
