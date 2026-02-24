
import { useState, useEffect } from 'react'
import { catalogApi } from '@/services/CatalogService'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { CategorySidebar } from '@/components/CategorySidebar'


export default function CatalogPage() {
    const [catProducts, setCatProducts] = useState<any[]>([])
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);


    useEffect(() => {


        const loadCatalog = async () => {

            try {
                const data = await catalogApi.getCatalog()
                setCatProducts(data)
                setFilteredProducts(data)
            } catch (error) {
                console.error("Error al cargar el catálogo:", error)
            }

        }



        loadCatalog()

    }, [])


    const handleSelectSubCategory = (subId: number) => {
        console.log("Filtrando por subcategoría:", subId);


        const filtered = catProducts.filter(p => p.subCategoryId === subId);
        setFilteredProducts(filtered);
    };

    return (
        <div className="flex flex-col min-h-screen w-full ">
            <div className='w-full max-[1187px]:px-4 max-w-[1187px] mx-auto py-8 flex-grow'>
                <h1 className='text-3xl font-bold text-gray-800 mb-8 border-b pb-4'>
                    Catálogo de Productos
                </h1>

                {/* Contenedor Flex para Sidebar + Productos */}
                <div className='flex flex-col md:flex-row gap-8'>

                    {/* Sidebar (izquierda) */}
                    <div className='w-full md:w-64 shrink-0'>
                        <CategorySidebar onSelectSubCategory={handleSelectSubCategory} />
                    </div>

                    {/* Grilla de Productos (derecha) */}
                    <div className='flex-1'>
                        {filteredProducts.length === 0 ? (
                            <p className='text-gray-500'>No hay productos que coincidan con la selección</p>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {filteredProducts.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
