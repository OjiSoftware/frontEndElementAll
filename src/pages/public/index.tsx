import homeBg from '@/assets/background_home.jpg';
import logoElementAll3 from '@/assets/logo_elementAll3.png';
import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { TagIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
    // ---------------- STATE ----------------
    const [search, setSearch] = useState(""); // estado de búsqueda

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
            {/* Sección Superior (Navbar + Hero) - Se estira para cubrir el resto de la pantalla, pero manteniendo como mínimo el 61.8% del alto */}
            <div className="flex flex-col h-[61.8vh] flex-grow">
                <div>
                    {/* Navbar con búsqueda */}
                    <Navbar search={search} setSearch={setSearch} />
                </div>

                {/* Contenido principal con imagen de fondo */}
                <div
                    className=" w-full flex-grow flex flex-col bg-cover bg-no-repeat bg-[center_top_20%]"
                    style={{ backgroundImage: `url(${homeBg})` }}
                >
                    <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto flex-grow flex flex-col">
                        {/* Espaciador superior (aprox 38.2% de la proporción áurea) */}
                        <div className="flex-grow-[382]"></div>

                        {/* Contenedor Flex para H1 (Izquierda) y Logo (Derecha) */}
                        <div className="w-full flex justify-between items-center">
                            <div className="w-full md:w-[38.2%]">
                                <h1 className="text-[1.1rem] lg:text-[1.2rem] font-bold font-poppins text-[#2f3027] text-left leading-tight">
                                    Soluciones que protegen y potencian tu
                                    negocio.
                                </h1>
                            </div>

                            {/* Logo ElementAll3 a la derecha */}
                            <div className="hidden md:block w-28 lg:w-40 xl:w-56 opacity-80">
                                <img
                                    src={logoElementAll3}
                                    alt="ElementAll Logo"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        {/* Espaciador inferior (aprox 61.8% de la proporción áurea) */}
                        <div className="flex-grow-[618]"></div>
                    </div>
                </div>
            </div>

            {/* Nueva Sección Inferior - Ocupa un mínimo del 38.2% del alto de la pantalla */}
            <div className="bg-[#e5e7eb] w-full flex flex-col items-center justify-center shadow-md relative z-10 border-t border-white ">
                <div className="w-full h-full max-h-[380px] max-[1187px]:px-4 max-w-[1187px] mx-auto flex flex-col justify-center pt-5 pb-6">
                    {/* Header de Categorias */}
                    <div className="flex justify-between items-end mb-4 pt-0">
                        <h2 className="text-[1.1rem] lg:text-[1.2rem] font-bold font-poppins text-[#2f3027] text-left leading-tight">
                            Categorias destacadas
                        </h2>
                    </div>

                    {/* Cards de Categorias */}
                    <div className="flex w-full stretch md:justify-between gap-3 md:gap-4 overflow-x-auto md:py-0 md:pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {[
                            {
                                id: 1,
                                name: "HERBICIDAS",
                                image: "https://tatauy.vtexassets.com/arquivos/ids/786893/6914ea784fa5808d63a0baac.jpg?v=638985752481330000",
                            },
                            {
                                id: 2,
                                name: "INSECTICIDAS",
                                image: "https://tatauy.vtexassets.com/arquivos/ids/786893/6914ea784fa5808d63a0baac.jpg?v=638985752481330000",
                            },
                            {
                                id: 3,
                                name: "FERTILIZANTES",
                                image: "https://tatauy.vtexassets.com/arquivos/ids/786893/6914ea784fa5808d63a0baac.jpg?v=638985752481330000",
                            },
                            {
                                id: 4,
                                name: "COADYUVANTES",
                                image: "https://tatauy.vtexassets.com/arquivos/ids/786893/6914ea784fa5808d63a0baac.jpg?v=638985752481330000",
                            },
                            {
                                id: 5,
                                name: "SEMILLAS",
                                image: "https://tatauy.vtexassets.com/arquivos/ids/786893/6914ea784fa5808d63a0baac.jpg?v=638985752481330000",
                            },
                        ].map((cat) => (
                            <div
                                key={cat.id}
                                className="bg-white rounded-xl shadow-sm p-2.5 lg:p-3 flex flex-col items-center justify-between hover:shadow-md transition-shadow aspect-[3/4] w-full min-w-[calc(50%-6px)] md:min-w-[115px] max-w-[215px] flex-auto snap-start shrink-0"
                            >
                                <div className="w-full h-full flex items-center justify-center mb-1.5 overflow-hidden">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="h-full w-full object-contain mix-blend-multiply"
                                    />
                                </div>
                                <h3 className="text-[#3d3d3d] font-bold text-[13px] tracking-widest uppercase font-lato text-center mb-1">
                                    {cat.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Sección ¿Por qué elegirnos? */}
            <div className="w-full bg-[#f1f3f5] md:bg-white py-8 md:py-16">
                <div className="max-w-[1187px] mx-auto px-4">
                    <h2 className="text-center text-[1.1rem] lg:text-[1.2rem] font-bold font-poppins text-[#2f3027] mb-6">
                        ¿Por qué elegirnos?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                        {/* Item 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3 md:mb-4 text-[#3ba732] flex items-center justify-center w-[60px] h-[60px] md:w-20 md:h-20">
                                <TagIcon className="w-12 h-12 md:w-16 md:h-16 stroke-[1.5] -rotate-45" />
                                <div className="absolute inset-0 flex items-center justify-center -mt-1 md:-mt-2 ml-1 md:ml-2">
                                    <span className="text-lg md:text-2xl font-bold font-sans">$</span>
                                </div>
                            </div>
                            <h3 className="text-[14px] md:text-[1.1rem] font-bold text-[#3d3d3d] mb-1 md:mb-2 font-lato">
                                Precios competitivos
                            </h3>
                            <p className="text-gray-500 text-[12px] md:text-[15px] leading-snug px-4 md:px-2 max-w-[280px]">
                                Potenciamos la productividad de tu campo minimizando tus gastos.
                            </p>
                        </div>

                        {/* Item 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3 md:mb-4 text-[#3ba732] flex items-center justify-center w-[60px] h-[60px] md:w-20 md:h-20">
                                <CreditCardIcon className="w-12 h-12 md:w-16 md:h-16 stroke-[1.5]" />
                                <div className="absolute bottom-0 md:bottom-1 right-[-4px] md:right-0 rounded-full bg-[#f1f3f5] md:bg-white pb-0.5">
                                    <ShieldCheckIcon className="w-6 h-6 md:w-8 md:h-8 stroke-[2] fill-white text-[#3ba732]" />
                                </div>
                            </div>
                            <h3 className="text-[14px] md:text-[1.1rem] font-bold text-[#3d3d3d] mb-1 md:mb-2 font-lato">
                                Pago seguro
                            </h3>
                            <p className="text-gray-500 text-[12px] md:text-[15px] leading-snug px-4 md:px-2 max-w-[280px]">
                                Lo más importante para nosotros es tu confianza.
                            </p>
                        </div>

                        {/* Item 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3 md:mb-4 text-[#3ba732] flex items-center justify-center w-[60px] h-[60px] md:w-20 md:h-20">
                                <DocumentTextIcon className="w-12 h-12 md:w-16 md:h-16 stroke-[1.5]" />
                                <div className="absolute bottom-0 md:bottom-1 right-[-4px] md:right-0 rounded-full bg-[#f1f3f5] md:bg-white">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
                                        <div className="absolute inset-0 flex items-center justify-center pb-0.5 md:pb-1 pr-0.5 md:pr-1">
                                            <svg className="w-3 h-3 md:w-4 md:h-4 text-[#3ba732]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-[14px] md:text-[1.1rem] font-bold text-[#3d3d3d] mb-1 md:mb-2 font-lato">
                                Trazabilidad garantizada
                            </h3>
                            <p className="text-gray-500 text-[12px] md:text-[15px] leading-snug px-4 md:px-2 max-w-[280px]">
                                Garantizamos el origen y la calidad de cada lote.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
