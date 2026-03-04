import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Mail, MapPin } from "lucide-react";
import elementAll3Logo from "@/assets/logo_elementAll3.png";

export default function ContactoPage() {
  // ---------------- STATE ----------------
  const [search, setSearch] = useState(""); // estado de búsqueda

  const phoneNumber = "5491112345678";
  const displayPhone = "+54 9 11 1234-5678";
  const email = "contacto@random.com";
  const address = "Av. Juan Perez 742, Cordoba";

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
      <Navbar search={search} setSearch={setSearch} />

      {/* Contenedor principal con márgenes centrado al estilo del catalog */}
      <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto py-8 lg:py-12 flex-grow flex flex-col">

        {/* Contenedor Blanco y Redondeado (Card) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-12 w-full flex-1 flex flex-col justify-center relative overflow-hidden">

          {/* Logo Watermark de Fondo */}
          <img
            src={elementAll3Logo}
            alt="ElementAll Logo Background"
            className="absolute bottom-0 right-0 w-[61%] object-contain opacity-[0.15] pointer-events-none select-none z-0 transform translate-x-[5%] translate-y-[5%]"
          />

          <div className="relative z-10 w-full flex flex-col items-start lg:block">
            <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold font-poppins mb-4 text-[#2f3027] leading-tight text-left">
              Contactanos
            </h1>
            <p className="text-gray-500 mb-10 text-[14px] md:text-[16px] leading-snug text-left max-w-2xl font-lato">
              Estamos acá para ayudarte. Si tenés preguntas, comentarios o necesitás asistencia, no dudes en escribirnos por cualquiera de estos medios.
            </p>

            <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-16">
              <div className="flex flex-col gap-4 w-full lg:w-1/2 max-w-xl">
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 group p-4 rounded-xl bg-white border border-[#e5e7eb] hover:border-[#25D366]/50 hover:shadow-sm transition-all duration-300"
                >
                  <div className="bg-[#f1f3f5] p-3.5 rounded-xl text-[#25D366] group-hover:bg-[#dcf8c6] transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-circle"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-[12px] uppercase tracking-wider text-gray-500 font-bold mb-1 font-lato">WhatsApp</p>
                    <p className="text-[16px] font-bold text-[#3d3d3d] font-sans pb-1">
                      {displayPhone}
                    </p>
                    <span className="text-[13px] font-medium text-[#25D366] group-hover:underline font-lato">
                      Abrir chat de WhatsApp →
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-5 group p-4 rounded-xl bg-white border border-[#e5e7eb] hover:border-[#3ba732]/50 hover:shadow-sm transition-all duration-300"
                >
                  <div className="bg-[#f1f3f5] p-3.5 rounded-xl text-[#3ba732] group-hover:bg-[#e4f0e3] transition-colors duration-300">
                    <Mail size={24} strokeWidth={2} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[12px] uppercase tracking-wider text-gray-500 font-bold mb-1 font-lato">Correo Electrónico</p>
                    <p className="text-[16px] font-bold text-[#3d3d3d] font-sans">{email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group p-4 rounded-xl bg-white border border-[#e5e7eb] hover:border-[#3ba732]/50 hover:shadow-sm transition-all duration-300">
                  <div className="bg-[#f1f3f5] p-3.5 rounded-xl text-[#3ba732] group-hover:bg-[#e4f0e3] transition-colors duration-300">
                    <MapPin size={24} strokeWidth={2} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[12px] uppercase tracking-wider text-gray-500 font-bold mb-1 font-lato">Ubicación</p>
                    <p className="text-[16px] font-bold text-[#3d3d3d] font-sans">{address}</p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Elemento de Diseño (Hogar y Jardín) */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">



                {/* Botón Catalogo o info */}
                <div className="bg-[#3ba732] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden group">

                  <div className="relative">
                    <h3 className="text-[1.2rem] font-bold font-poppins mb-2">Explorá</h3>
                    <p className="text-white/80 text-[14px] font-lato mb-4">Descubrí nuestros productos destacados con precios exclusivos para clientes.</p>
                    <a href="/catalogo" className="inline-flex items-center gap-2 bg-white text-[#3ba732] px-5 py-2.5 rounded-xl text-[14px] font-bold font-sans hover:bg-gray-50 transition-colors">
                      Ver Catálogo Completo
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </a>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
