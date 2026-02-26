import React from "react";
import { CartItem } from "@/context/CartContext";
import CartRow from "@/components/CartRow";

interface CartTableProps {
    cart: CartItem[];
}

const CartTable: React.FC<CartTableProps> = ({ cart }) => {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2 border-b">Producto</th>
                    <th className="p-2 border-b">Precio</th>
                    <th className="p-2 border-b">Cantidad</th>
                    <th className="p-2 border-b">Subtotal</th>
                    <th className="p-2 border-b">Acción</th>
                </tr>
            </thead>
            <tbody>
                {cart.map((item) => (
                    <CartRow key={item.product.id} item={item} />
                ))}
            </tbody>
        </table>
    );
};

export default CartTable;
