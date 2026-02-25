import homeBg from '@/assets/background_home.jpg';
import logoElementAll3 from '@/assets/logo_elementAll3.png';
import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


export default function HomePage() {
  // ---------------- STATE ----------------
  const [search, setSearch] = useState(""); // estado de búsqueda

  return (
      <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
          {/* Sección Superior (Navbar + Hero) - Ocupa el 61.8% del alto de la pantalla */}
          <div className="flex flex-col h-[61.8vh]">
              <div>
                {/* Navbar con búsqueda */}
                <Navbar search={search} setSearch={setSearch} />
              </div>

              {/* Contenido principal con imagen de fondo */}
              <div
                  className="w-full flex-grow flex flex-col bg-cover bg-no-repeat bg-[center_top_20%]"
                  style={{ backgroundImage: `url(${homeBg})` }}
              >
                  <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto flex-grow flex flex-col">
                      {/* Espaciador superior (aprox 38.2% de la proporción áurea) */}
                      <div className="flex-grow-[382]"></div>

                      {/* Contenedor Flex para H1 (Izquierda) y Logo (Derecha) */}
                      <div className="w-full flex justify-between items-center">
                          <div className="w-full md:w-[38.2%]">
                              <h1 className="text-lg font-bold font-poppins text-[#2f3027] text-left leading-tight">
                                  Soluciones que protegen y potencian tu
                                  negocio.
                              </h1>
                          </div>

                          {/* Logo ElementAll3 a la derecha */}
                          <div className="hidden md:block w-32 lg:w-48 xl:w-64 opacity-80">
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
          <div className="min-h-[36.2vh] pt-6 pb-8 bg-[#e5e7eb] w-full flex flex-col items-center justify-center">
              <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto flex flex-col justify-center h-full">
                  {/* Header de Categorias */}
                  <div className="flex justify-between items-end mb-6 pt-0">
                      <h2 className="text-lg font-bold font-poppins text-[#2f3027] text-left leading-tight">
                          Categorias destacadas
                      </h2>
                  </div>

                  {/* Cards de Categorias */}
                  <div className="flex w-full justify-between gap-2 md:gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                              className="bg-white rounded-2xl shadow-sm p-3 lg:p-4 flex flex-col items-center justify-between hover:shadow-md transition-shadow aspect-[3/4] w-full min-w-[130px] max-w-[210px] flex-1"
                          >
                              <div className="w-full flex-grow flex items-center justify-center p-2 mb-2">
                                  <img
                                      src={cat.image}
                                      alt={cat.name}
                                      className="h-24 md:h-30 object-contain mix-blend-multiply"
                                  />
                              </div>
                              <h3 className="text-[#3d3d3d] font-bold text-sm tracking-widest uppercase font-lato text-center mb-2">
                                  {cat.name}
                              </h3>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <Footer />
      </div>
  );
}
