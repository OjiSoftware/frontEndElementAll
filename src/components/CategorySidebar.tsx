import { useEffect, useState } from 'react';
import { catalogApi } from '@/services/CatalogService';


interface SidebarProps {
    onSelectSubCategory: (id: number) => void;
    onSelectBrand: (id: number) => void;
    onClearFilters: () => void;
}
export function CategorySidebar({ onSelectSubCategory, onSelectBrand, onClearFilters }: SidebarProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([])

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const [categoryData, brandData] = await Promise.all([
                    catalogApi.getCategoryTree(),
                    catalogApi.getActivesBrands()
                ]);

                setCategories(categoryData);
                setBrands(brandData)

            } catch (error) {
                console.error("Error cargando el menú de sidebar:", error);
            }
        };
        loadMenu();
    }, []);

    return (
        <aside className="w-64 flex-shrink-0">
            {/* Contenedor principal estilo Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">

                {/* Botón "Ver Todo" integrado dentro de la card */}
                <button
                    onClick={onClearFilters}
                    className="w-full mb-8 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                    VER TODO
                </button>

                {/* SECCIÓN DE CATEGORÍAS */}
                <div className="mb-8">
                    <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight mb-6">
                        Categorías
                    </h2>

                    <ul className="space-y-6">
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                {/* Nombre de Línea (Hogar, Jardín, etc) */}
                                <h3 className="text-gray-500 font-semibold text-sm mb-3 hover:text-green-600 transition-colors cursor-default">
                                    {cat.name}
                                </h3>

                                {/* Subcategorías con el indentado de la imagen */}
                                <ul className="ml-4 space-y-2">
                                    {cat.subCategories?.map((sub: any) => (
                                        <li
                                            key={sub.id}
                                            onClick={() => onSelectSubCategory(sub.id)}
                                            className="text-gray-400 text-[13px] hover:text-green-500 cursor-pointer transition-all duration-200"
                                        >
                                            {sub.name}
                                        </li>
                                    ))}
                                </ul>

                                {/* Separador sutil entre líneas de categorías */}
                                <hr className="mt-6 border-gray-50" />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SECCIÓN DE MARCAS */}
                <div>
                    <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight mb-4">
                        Nuestras Marcas
                    </h2>
                    <ul className="space-y-1">
                        {brands.map((brand) => (
                            <li
                                key={brand.id}
                                onClick={() => onSelectBrand(brand.id)}
                                className="px-2 py-1 text-gray-400 text-[13px] hover:text-green-600 cursor-pointer transition-colors"
                            >
                                • {brand.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}