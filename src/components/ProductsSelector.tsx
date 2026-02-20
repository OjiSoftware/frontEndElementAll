import React, { useState } from 'react';
import { Product } from '../types/product.types';
import { useProducts } from '../hooks/useProductsList';

const ProductSelector = ({ products, onProductSelect }) => {
  const [selectedId, setSelectedId] = useState("");

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    
    // Buscamos el objeto completo para pasarlo al formulario de venta
    const product = products.find(p => p.id === parseInt(id));
    if (onProductSelect) onProductSelect(product);
  };

  return (
    <div className="w-full max-w-sm">
      <label 
        htmlFor="product-select" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Seleccionar Producto
      </label>
      
      <div className="relative">
        <select
          id="product-select"
          value={selectedId}
          onChange={handleChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border shadow-sm bg-white appearance-none"
        >
          <option value="" disabled>
            -- Elige un producto --
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} — ${product.price}
            </option>
          ))}
        </select>
        
        {/* Icono de flecha personalizado */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {selectedId && (
        <p className="mt-2 text-xs text-gray-500">
          ID seleccionado: <span className="font-mono">{selectedId}</span>
        </p>
      )}
    </div>
  );
};

export default ProductSelector;