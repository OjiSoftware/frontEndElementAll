// Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo_elementAll2.png";
import SearchBar from "@/components/SearchBar";
import { catalogApi } from "@/services/CatalogService";
import { Product } from "@/types/product.types";

interface NavbarProps {
    search: string;
    setSearch: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ search, setSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [catProducts, setCatProducts] = useState<Product[]>([]); // todos los productos
    const [suggestions, setSuggestions] = useState<Product[]>([]); // filtrados
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // controla visibilidad
    const wrapperRef = useRef<HTMLDivElement>(null); // detecta click fuera

    // Cargar catálogo al montar
    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const data = await catalogApi.getCatalog();
                setCatProducts(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadCatalog();
    }, []);

    // Manejo de búsqueda con dropdown
    const handleSearchChange = (value: string) => {
        setSearch(value);

        if (!value.trim()) {
            setSuggestions([]);
            setIsDropdownOpen(false);
            return;
        }

        const filtered = catProducts.filter((p) =>
            p.name.toLowerCase().includes(value.toLowerCase()),
        );

        setSuggestions(filtered.slice(0, 5)); // máximo 5 sugerencias
        setIsDropdownOpen(filtered.length > 0);
    };

    // Cerrar dropdown al click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="w-full bg-[#4caf50] shadow-md relative z-10">
            <div className="max-w-[1200px] mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Botón Menú Móvil */}
                    <button
                        className="md:hidden text-white p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isMenuOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>

                    {/* Logo */}
                    <div className="shrink-0">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-15 md:h-16 object-contain"
                        />
                    </div>

                    {/* Bloque Central */}
                    <div className="hidden md:flex flex-1 flex-col items-center max-w-[650px]">
                        {/* SearchBar Desktop */}
                        <SearchBar
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="¿Qué estás buscando?"
                            containerClassName="w-full mb-3"
                            inputClassName="
                                bg-[#8bc34a]
                                text-white
                                placeholder:text-green-100
                                border-none
                                py-2
                                h-auto
                                font-lato
                            "
                            iconClassName="text-white/80"
                        />

                        {/* ----------------- ✅ DROPDOWN ----------------- */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-20">
                                {suggestions.map((p) => (
                                    <div
                                        key={p.id}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            setSearch(p.name);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {p.name}
                                    </div>
                                ))}
                                {suggestions.length === 0 && (
                                    <div className="px-4 py-2 text-gray-500">
                                        No hay resultados
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Enlaces Desktop */}
                        <div className="flex w-full justify-between text-[12px] font-bold font-lato uppercase tracking-widest">
                            <a
                                href="#"
                                className="text-white hover:text-[#f9c72a] transition-colors"
                            >
                                Inicio
                            </a>
                            <a
                                href="#"
                                className="text-white hover:text-[#f9c72a] transition-colors"
                            >
                                Nosotros
                            </a>
                            <a
                                href="#"
                                className="text-white hover:text-[#f9c72a] transition-colors"
                            >
                                Contacto
                            </a>
                            <a
                                href="#"
                                className="text-white hover:text-[#f9c72a] transition-colors"
                            >
                                Tienda
                            </a>
                        </div>
                    </div>

                    {/* Carrito */}
                    <div className="relative cursor-pointer shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 md:h-8 md:w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293
                                2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0
                                100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <span className="absolute -top-2 -right-2 bg-[#A94442] text-white font-poppins text-[10px] font-bold h-4 w-4 md:h-5 md:w-5 flex items-center justify-center rounded-full border-2 border-[#5CB85C]">
                            5
                        </span>
                    </div>
                </div>

                {/* SearchBar Mobile */}
                <div className="mt-3 md:hidden">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Buscar..."
                        inputClassName="
                            bg-[#82C355]
                            text-white
                            placeholder:text-green-100
                            border-none
                            py-2
                            h-auto
                            text-sm
                            font-lato
                        "
                        iconClassName="text-white/80"
                    />
                </div>
            </div>

            {/* Menú Mobile */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#4cae4c] border-t border-green-400">
                    <div className="flex flex-col p-4 space-y-4 text-sm font-bold font-lato uppercase tracking-widest">
                        <a href="#" className="text-[#D9E968]">
                            Inicio
                        </a>
                        <a href="#" className="text-[#D9E968]">
                            Nosotros
                        </a>
                        <a href="#" className="text-[#D9E968]">
                            Contacto
                        </a>
                        <a
                            href="#"
                            className="text-white underline decoration-2 underline-offset-4"
                        >
                            Tienda
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
