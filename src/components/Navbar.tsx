import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/logo_elementAll2.png";
import SearchBar from "@/components/SearchBar";
import { catalogApi } from "@/services/CatalogService";
import { Product } from "@/types/product.types";
import { useCart } from "@/context/CartContext";
import { MagnifyingGlassIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface NavbarProps {
    search?: string;
    setSearch?: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ search: externalSearch, setSearch: externalSetSearch }) => {
    const [searchParams] = useSearchParams();
    const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");
    const search = externalSearch !== undefined ? externalSearch : localSearch;
    const setSearch = externalSetSearch || setLocalSearch;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [catProducts, setCatProducts] = useState<Product[]>([]);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showEmptyToast, setShowEmptyToast] = useState(false); // ✅ Estado para el toast
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const { totalItems } = useCart();
    const navigate = useNavigate();

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

    // Manejo de búsqueda
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

        setSuggestions(filtered.slice(0, 5));
        setIsDropdownOpen(filtered.length > 0);
    };

    const handleSearchSubmit = (value: string) => {
        if (value.trim()) {
            setIsDropdownOpen(false);
            navigate(`/catalogo?search=${encodeURIComponent(value.trim())}`);
        } else {
            navigate(`/catalogo`);
        }
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
        <nav className="w-full bg-[#4caf50] shadow-md relative z-10 border-b border-gray-400">
            <div className="max-w-[1187px] mx-auto px-4 py-3 md:py-4">
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
                            className="h-20 md:h-16 object-contain my-1"
                            onClick={() => navigate("/")}
                            style={{ cursor: "pointer" }}
                        />
                    </div>

                    {/* Bloque Central */}
                    <div className="hidden md:flex flex-1 flex-col items-center max-w-[650px] mt-1 relative" ref={wrapperRef}>
                        <SearchBar
                            value={search}
                            onChange={handleSearchChange}
                            onSubmit={handleSearchSubmit}
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

                        {isDropdownOpen && (
                            <div className="absolute top-[55px] center w-[650px] bg-white shadow-xl rounded-xl mt-1 max-h-80 overflow-y-auto z-20 border border-gray-100 divide-y divide-gray-50">
                                {suggestions.map((p) => (
                                    <div
                                        key={p.id}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors group"
                                        onClick={() => {
                                            setSearch(p.name);
                                            setIsDropdownOpen(false);
                                            navigate(`/catalogo?search=${encodeURIComponent(p.name)}`);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-full text-gray-500 group-hover:bg-green-50 group-hover:text-[#4caf50] transition-colors">
                                                <MagnifyingGlassIcon className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-700 font-poppins text-[14px]">{p.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-[#4caf50] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Ver</span>
                                    </div>
                                ))}
                                {suggestions.length === 0 && (
                                    <div className="px-6 py-8 text-center text-gray-500 flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="font-semibold text-gray-700 mb-1 font-poppins">No encontramos lo que buscás</p>
                                        <p className="text-sm text-gray-500 font-lato">
                                            Intentá con otras palabras o{' '}
                                            <NavLink to="/contacto" className="text-[#4caf50] hover:text-[#f9c72a] font-semibold underline transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                contactanos
                                            </NavLink>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex w-full justify-between text-[13px] subpixel-antialiased font-normal font-lato uppercase tracking-[0.2rem] mt-2">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                                }
                            >
                                Inicio
                            </NavLink>
                            <NavLink
                                to="/nosotros"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                                }
                            >
                                Nosotros
                            </NavLink>
                            <NavLink
                                to="/contacto"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                                }
                            >
                                Contacto
                            </NavLink>
                            <NavLink
                                to="/catalogo"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                                }
                            >
                                Tienda
                            </NavLink>
                        </div>
                    </div>

                    {/* Carrito */}
                    <div
                        className="relative cursor-pointer shrink-0"
                        ref={cartRef}
                        onClick={() => {
                            if (totalItems === 0) {
                                setShowEmptyToast(true);
                                setTimeout(
                                    () => setShowEmptyToast(false),
                                    2000,
                                );
                                return;
                            }
                            navigate("/cart");
                        }}
                    >
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

                        {/* Toast al lado del carrito */}
                        {showEmptyToast && cartRef.current && (
                            <div
                                className="flex items-center gap-1.5"
                                style={{
                                    position: "absolute",
                                    top: -2,
                                    left: cartRef.current.offsetWidth + 20,
                                    background: "rgba(139, 0, 0, 0.7)", // Bordó semitransparente
                                    backdropFilter: "blur(12px)",
                                    WebkitBackdropFilter: "blur(12px)",
                                    border: "1px solid rgba(255, 100, 100, 0.3)", // Borde rojizo sutil
                                    color: "white",
                                    padding: "6px 14px",
                                    borderRadius: "8px",
                                    zIndex: 50,
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 4px 15px rgba(139, 0, 0, 0.3)", // Sombra bordó
                                    fontWeight: "500",
                                    fontSize: "13px",
                                }}
                            >
                                <ExclamationCircleIcon className="w-5 h-5 text-red-200" strokeWidth={2} />
                                <span>El carrito está vacío</span>
                            </div>
                        )}

                        <span className="absolute -top-2 -right-2.5 bg-[#A94442] text-white font-poppins text-[10px] font-bold h-4 w-4 md:h-5! md:w-5! flex items-center justify-center rounded-full border-2 border-[#5CB85C]">
                            {totalItems}
                        </span>
                    </div>
                </div>

                {/* SearchBar Mobile */}
                <div className="mt-3 md:hidden">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearchSubmit}
                        placeholder="Buscar productos..."
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
                    <div className="flex flex-col p-4 space-y-4 text-[15px] font-bold font-lato uppercase tracking-widest">
                        <NavLink
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                            }
                        >
                            Inicio
                        </NavLink>
                        <NavLink
                            to="/nosotros"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                            }
                        >
                            Nosotros
                        </NavLink>
                        <NavLink
                            to="/contacto"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                            }
                        >
                            Contacto
                        </NavLink>
                        <NavLink
                            to="/catalogo"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-[#f9c72a]" : "text-white hover:text-[#f9c72a]"}`
                            }
                        >
                            Tienda
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
