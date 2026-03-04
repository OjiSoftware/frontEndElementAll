import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PrivacidadPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
      <Navbar search={search} setSearch={setSearch} />

      <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto py-8 lg:py-12 flex-grow flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-12 w-full flex-1 flex flex-col relative overflow-hidden">

          <div className="relative z-10 w-full flex flex-col items-start lg:block">
            <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold font-poppins mb-6 text-[#2f3027] leading-tight text-left">
              Políticas de Privacidad
            </h1>

            <div className="text-[14px] md:text-[16px] text-gray-500 font-lato max-w-4xl space-y-6 text-left leading-relaxed">
              <p>
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-AR')}
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">1. Introducción</h3>
              <p>
                En ElementAll (en adelante, "la Empresa"), respetamos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y compartimos la información personal de los usuarios que visitan y utilizan nuestro sitio web. Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política, de conformidad con la Ley de Protección de Datos Personales N° 25.326 de la República Argentina.
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">2. Recopilación de Información</h3>
              <p>
                Recopilamos información personal que usted nos proporciona voluntariamente al registrarse, realizar una compra o completar formularios en nuestro sitio (como su nombre, dirección de correo electrónico, DNI, número de teléfono y dirección). Asimismo, recopilamos automáticamente cierta información sobre su dispositivo y comportamiento de navegación a través de cookies y herramientas similares.
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">3. Uso de la Información</h3>
              <p>
                La información personal recopilada se utiliza para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Procesar y gestionar sus pedidos y pagos.</li>
                <li>Brindarle atención al cliente y responder a sus consultas.</li>
                <li>Mejorar nuestra plataforma y personalizar su experiencia de usuario.</li>
                <li>Enviar comunicaciones informativas y promocionales (puede optar por no recibirlas en cualquier momento).</li>
                <li>Cumplir con obligaciones legales y regulatorias.</li>
              </ul>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">4. Derechos del Titular de los Datos</h3>
              <p>
                De acuerdo con la legislación vigente, usted tiene el derecho de acceder, rectificar, actualizar o solicitar la eliminación de sus datos personales. Para ejercer estos derechos, puede contactarnos a través de los canales informados en nuestra sección de Contacto.
              </p>

              <h3 className="text-[0.8rem] lg:text-[0.9rem] font-bold font-poppins text-[#2f3027] mt-8 mb-3">5. Seguridad</h3>
              <p>
                La Empresa implementa medidas de seguridad técnicas y organizativas adecuadas para proteger su información personal contra accesos no autorizados, alteraciones, divulgación o destrucción. No obstante, ninguna transmisión de datos a través de Internet o sistema de almacenamiento electrónico es 100% segura.
              </p>


            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
