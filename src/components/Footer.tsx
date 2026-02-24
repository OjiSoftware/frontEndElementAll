import React from "react";
import background from "@/assets/background.jpg";
import logo from "@/assets/logo_elementAll.png";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto">

      <div
        className="w-full h-25 md:h-28 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      <div className="bg-[#363936] text-white pt-10 pb-6 w-full">
        <div className="w-full max-[1187px]:px-6 max-w-[1187px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start gap-3">
              <img
                src={logo}
                alt="ElementAll Logo"
                className="h-20 object-contain -ml-2 -mt-2"
              />
              <p className="text-sm text-gray-200 font-medium max-w-xs mt-1">
                Cuidamos tus espacios, potenciamos tu trabajo.
              </p>
              <a
                href="#"
                className="text-sm text-gray-300 underline hover:text-white transition-colors"
              >
                Sobre nosotros
              </a>
            </div>

            <div className="flex flex-col items-start">
              <h3 className="text-lg font-bold mb-4">Contacto</h3>
              <p className="text-sm text-gray-300 mb-2">
                +54 9 35** 000000
              </p>
              <p className="text-sm text-gray-300">
                email@email.com
              </p>
            </div>

            <div className="flex flex-col items-start">
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Botón de Arrepentimiento
                </a>
                <p className="text-sm text-gray-300">
                  Defensa de las y los Consumidores. <a href="#" className="underline hover:text-white transition-colors">Para reclamos ingrese aquí</a>
                </p>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Libro de Quejas
                </a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Políticas de Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-10 pt-6">
          <div className="w-full max-[1187px]:px-6 max-w-[1187px] mx-auto">
            <p className="text-xs text-gray-400 text-left">
              © 2026 ElementAll | Todos los derechos reservados. Desarrollado por OJI Software.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
