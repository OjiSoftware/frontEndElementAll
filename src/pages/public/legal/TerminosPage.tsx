import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TerminosPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
      <Navbar search={search} setSearch={setSearch} />

      <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto py-8 lg:py-12 flex-grow flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-12 w-full flex-1 flex flex-col relative overflow-hidden">

          <div className="relative z-10 w-full flex flex-col items-start lg:block">
            <h1 className="text-[1.1rem] lg:text-[1.2rem] font-bold font-poppins text-[#2f3027] text-left leading-tight pb-4">
              Términos y Condiciones
            </h1>

            <div className="text-[14px] md:text-[16px] text-gray-500 font-lato max-w-4xl space-y-6 text-left leading-relaxed">
              <p>
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-AR')}
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">1. Aceptación de los Términos</h3>
              <p>
                Al acceder y utilizar el sitio web de ElementAll (en adelante "el Sitio"), el usuario (en adelante "el Usuario") acepta estar sujeto a los presentes Términos y Condiciones, así como a las Políticas de Privacidad y otras normativas que resulten de aplicación. Si no está de acuerdo con estos términos, le rogamos que no utilice nuestro portal.
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">2. Información de Productos y Servicios</h3>
              <p>
                Si bien nos esforzamos en que la información publicada en nuestro Sitio, incluyendo pero no limitándose a descripciones de productos, características técnicas y fotografías, sea lo más precisa posible, pueden existir errores involuntarios. Las fotografías son de carácter ilustrativo y las especificaciones están sujetas a modificaciones sin previo aviso.
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">3. Condiciones Comerciales y Precios</h3>
              <p>
                Los precios exhibidos en la tienda online están expresados en pesos argentinos e incluyen los impuestos de ley vigentes. Los precios pueden ser modificados en cualquier momento por la Empresa. Las promociones no son acumulables con otras a menos que se indique explícitamente lo contrario.
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">4. Derecho de Arrepentimiento</h3>
              <p>
                De acuerdo con la legislación vigente de la República Argentina, el consumidor tiene derecho a revocar la aceptación del producto dentro del plazo de DIEZ (10) días corridos computados a partir de la entrega del bien. A tal efecto, brindamos el correspondiente "Botón de Arrepentimiento" en nuestro sitio y un "Libro de Quejas" a disposición de nuestros clientes. El producto debe ser devuelto en su estado original, sin uso y con sus empaques intactos.
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">5. Legislación Aplicable</h3>
              <p>
                Estos términos se regirán por las leyes aplicables de la República Argentina, en particular la Ley de Defensa del Consumidor (Ley N° 24.240 y sus modificatorias).
              </p>


            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
