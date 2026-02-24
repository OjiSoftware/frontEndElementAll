import { useEffect, useState } from 'react';
import { catalogApi } from '@/services/CatalogService';


interface SidebarProps {
    onSelectSubCategory: (id: number) => void;
}
export function CategorySidebar({ onSelectSubCategory }: SidebarProps) {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const data = await catalogApi.getCategoryTree();
                setCategories(data);
            } catch (error) {
                console.error("Error cargando el menú:", error);
            }
        };
        loadMenu();
    }, []);

    return (
        <aside className="w-64 p-4 bg-white border-r">
            <h2 className="font-bold text-gray-800 uppercase mb-4">Categorías</h2>
            <ul className="space-y-4">
                {categories.map((cat) => (
                    <li key={cat.id}>
                        {/* Título de la Categoría */}
                        <h3 className="text-green-600 font-bold hover:cursor-pointer">
                            {cat.name}
                        </h3>

                        {/* LISTA DE SUBCATEGORÍAS */}
                        <ul className="ml-4 mt-2 space-y-1">
                            {cat.subCategories?.map((sub: any) => (
                                <li onClick={() => onSelectSubCategory(sub.id)} key={sub.id} className="text-gray-600 text-sm hover:text-green-500 cursor-pointer">
                                    {sub.name}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </aside>
    );
}