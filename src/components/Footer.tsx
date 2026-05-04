import React from "react";
import background from "@/assets/background.jpg";
import logo from "@/assets/logo_elementAll.png";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto">

      <div
        className="w-full h-20 md:h-20 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      <div className="bg-[#2f3027] text-white pt-10 pb-6 w-full font-lato">
        <div className="w-full max-[1187px]:px-6 max-w-[1187px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start gap-3">

              <img
                src={logo}
                alt="ElementAll Logo"
                className="md:hidden h-20 object-contain pl-0.5 pt-1"
              />

              <img
                src={logo}
                alt="ElementAll Logo"
                className="hidden md:block h-30 object-contain pl-0.5 pt-1"
              />

              <p className="text-xs md:text-sm text-gray-200 font-medium font-lato max-w-xs mt-1">
                Cuidamos tus espacios, potenciamos tu trabajo.
              </p>
              <a
                href="#"
                className="text-xs md:text-sm text-gray-300 font-lato underline hover:text-white transition-colors"
              >
                Sobre nosotros
              </a>
            </div>

            <div className="flex flex-col items-start gap-2">
              <h3 className="text-lg font-bold font-poppins mt-3 md:mt-0 mb-2 md:mb-4">Contacto</h3>

              <p className="text-xs md:text-sm text-gray-300 font-lato">
                <span className="font-bold text-white">Domicilio:</span> Av. Falsa 123, X5000, Córdoba Capital, Córdoba.
              </p>
              <p className="text-xs md:text-sm text-gray-300 font-lato">
                <span className="font-bold text-white">Tel:</span> +54 9 351 0000000
              </p>
              <p className="text-sm text-gray-300 font-lato">
                <span className="font-bold text-white">Email:</span> contacto@elementall.com.ar
              </p>
            </div>

            <div className="flex flex-col items-start">
              <h3 className="text-lg font-bold font-poppins mt-3 md:mt-0 mb-2 md:mb-4">Legal</h3>
              <div className="flex flex-col gap-2">
                <a href="/arrepentimiento" className="text-xs md:text-sm text-gray-300 font-lato hover:text-white transition-colors">
                  Botón de Arrepentimiento
                </a>
                <p className="text-xs md:text-sm text-gray-300 font-lato">
                  Defensa de las y los Consumidores. <a href="https://defensadelconsumidor.cba.gov.ar/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Para reclamos ingrese aquí</a>
                </p>
                <a href="/libro-quejas" className="text-xs md:text-sm text-gray-300 font-lato hover:text-white transition-colors">
                  Libro de Quejas
                </a>
                <a href="/terminos-condiciones" className="text-xs md:text-sm text-gray-300 font-lato hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
                <a href="/politicas-privacidad" className="text-xs md:text-sm text-gray-300 font-lato hover:text-white transition-colors">
                  Políticas de Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#545454] mt-10 pt-6">
          <div className="w-full max-[1187px]:px-6 max-w-[1187px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 text-center md:text-left">
              © 2026 ElementAll | Todos los derechos reservados. Desarrollado por OJI Software.
            </p>

            {/* AFIP Data Fiscal AFIP obligatoria */}
            <a href="http://qr.afip.gob.ar/?qr=0000000000" target="_F960AFIPInfo" className="shrink-0 group">
              <img
                src="http://www.afip.gob.ar/images/f960/DATAWEB.jpg"
                alt="Data Fiscal AFIP"
                className="w-8 md:w-10 opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
