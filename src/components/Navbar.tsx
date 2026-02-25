import React, { useState } from 'react';
import logo from "@/assets/logo_elementAll.png";

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-[#5CB85C] shadow-md relative">
            {/* Contenedor Principal */}
            <div className="max-w-[1200px] mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4 md:gap-8">

                    {/* 1. Botón Menú Móvil (Solo visible en < md) */}
                    <button
                        className="md:hidden text-white p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>

                    {/* 2. Logo */}
                    <div className="shrink-0">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-12 md:h-20 object-contain"
                        />
                    </div>

                    {/* 3. Bloque Central (Buscador + Enlaces Desktop) */}
                    <div className="hidden md:flex flex-1 flex-col items-center max-w-[650px]">
                        {/* Buscador Desktop */}
                        <div className="w-full relative mb-3">
                            <input
                                type="text"
                                placeholder="¿Qué estás buscando?"
                                className="w-full py-2 px-10 rounded-lg text-white placeholder:text-green-100 focus:outline-none bg-[#82C355] border-none"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                        </div>

                        {/* Enlaces Desktop */}
                        <div className="flex w-full justify-between text-[12px] font-bold uppercase tracking-widest">
                            <a href="#" className="text-[#D9E968] hover:text-white transition-colors">Inicio</a>
                            <a href="#" className="text-[#D9E968] hover:text-white transition-colors">Nosotros</a>
                            <a href="#" className="text-[#D9E968] hover:text-white transition-colors">Contacto</a>
                            <a href="#" className="text-white border-b-2 border-white pb-0.5">Tienda</a>
                        </div>
                    </div>

                    {/* 4. Carrito */}
                    <div className="relative cursor-pointer shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="absolute -top-2 -right-2 bg-[#A94442] text-white text-[10px] font-bold h-4 w-4 md:h-5 md:w-5 flex items-center justify-center rounded-full border-2 border-[#5CB85C]">
                            5
                        </span>
                    </div>
                </div>

                {/* 5. Buscador Móvil (Solo visible en < md) */}
                <div className="mt-3 md:hidden">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full py-2 px-10 rounded-lg text-white placeholder:text-green-100 focus:outline-none bg-[#82C355] border-none text-sm"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            {/* 6. Menú Desplegable Móvil */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#4cae4c] border-t border-green-400">
                    <div className="flex flex-col p-4 space-y-4 text-sm font-bold uppercase tracking-widest">
                        <a href="#" className="text-[#D9E968]">Inicio</a>
                        <a href="#" className="text-[#D9E968]">Nosotros</a>
                        <a href="#" className="text-[#D9E968]">Contacto</a>
                        <a href="#" className="text-white underline decoration-2 underline-offset-4">Tienda</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;