import React from 'react';
import type { Product } from '../types/product.types';
import { useCart } from '@/context/CartContext';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {

    const { addToCart } = useCart();


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow duration-300 w-full max-w-60">
            {/* Imagen del Producto */}
            <div className="w-full h-40 flex items-center justify-center mb-4">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/150'}
                    alt={product.name || 'Nombre del producto'}
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

            {/* Botón Añadir al carrito */}
            <button
                className="mt-4 bg-[#4caf50] hover:bg-[#8bc34a] text-white py-2 px-3 rounded flex items-center justify-center gap-2 text-xs font-medium transition-colors"
                onClick={() => addToCart(product)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Añadir al carrito
            </button>
        </div>
    );
};

export default ProductCard;
