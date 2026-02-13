import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="w-full flex flex-col">
            {/*Logo, Buscador y Carrito */}
            <div className="bg-[#5CB85C] px-4 py-3 flex items-center justify-between gap-4 md:px-10">

                {/* Logo ) */}
                <div className="shrink-0">
                    <img
                        src="/logoElementAll.png"
                        alt="ElementAll Logo"
                        className="h-12 md:h-16 object-contain"
                    />
                </div>

                {/* Buscador */}
                <div className="grow max-w-2xl relative">
                    <input
                        type="text"
                        placeholder="¿Qué estás buscando?"
                        className="w-full py-2 px-4 pr-10 rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:border-transparent bg-green-500"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Carrito */}
                <div className="relative cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#5CB85C]">
                        5 {/* Aca tenemos que poner un contador cuando armemos las funciones del carrito */}
                    </span>
                </div>
            </div>

            {/*Enlaces */}
            <div className="bg-[#4cae4c] px-4 py-2 flex justify-center gap-8 text-white font-medium uppercase text-sm tracking-wider md:px-10">
                <a href="#" className="hover:text-green-100 transition-colors">Inicio</a>
                <a href="#" className="hover:text-green-100 transition-colors">Nosotros</a>
                <a href="#" className="hover:text-green-100 transition-colors">Contacto</a>
                <a href="#" className="text-yellow-300 font-bold border-b-2 border-yellow-300">Tienda</a>
            </div>
        </nav>
    );
};

export default Navbar;