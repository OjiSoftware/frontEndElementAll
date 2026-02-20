import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types/product.types';
import { Search, ChevronDown, X } from 'lucide-react';

interface ProductSelectorProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ products, onProductSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar el buscador si el usuario hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (product: Product) => {
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
            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          )}
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Lista Desplegable (Dropdown) */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-slate-800 border border-gray-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li
                key={product.id}
                onClick={() => handleSelect(product)}
                className="px-4 py-3 hover:bg-indigo-600 cursor-pointer flex justify-between items-center transition-colors group"
              >
                <span className="text-white font-medium">{product.name}</span>
                <span className="text-gray-400 group-hover:text-indigo-100 text-sm">
                  ${product.price}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-400 text-center text-sm">
              No se encontraron productos
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProductSelector;