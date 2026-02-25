// CatalogPage.tsx
import { useState, useEffect } from "react";
import { catalogApi } from "@/services/CatalogService";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { CategorySidebar } from "@/components/CategorySidebar";
import Pagination from "@/components/PaginationCatalog";
import { Product } from "@/types/product.types";
import Navbar from "@/components/Navbar";

export default function CatalogPage() {
    // ---------------- STATE ----------------
    const [catProducts, setCatProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState(""); // estado de búsqueda
    const itemsPerPage = 12;

    // ---------------- FETCH ----------------
    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const data = await catalogApi.getCatalog();
                setCatProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Error al cargar el catálogo:", error);
            }
        };
        loadCatalog();
    }, []);

    // ---------------- BUSQUEDA ----------------
    useEffect(() => {
        let filtered = catProducts;

        if (search.trim() !== "") {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        setFilteredProducts(filtered);
    }, [search, catProducts]);

    // ---------------- FILTROS ----------------
    const handleSelectSubCategory = (subId: number) => {
        const filtered = catProducts.filter(
            (p) => Number(p.subCategoryId) === subId,
        );
        setFilteredProducts(filtered);
    };

    const handleSelectBrand = (brandId: number) => {
        const filtered = catProducts.filter(
            (p) => Number(p.brandId) === brandId,
        );
        setFilteredProducts(filtered);
    };

    const handleClearFilters = () => {
        setFilteredProducts(catProducts);
    };

    // ---------------- PAGINACIÓN ----------------
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredProducts]);

    // ---------------- UI ----------------
    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Navbar con búsqueda */}
            <Navbar search={search} setSearch={setSearch} />

            <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto py-8 flex-grow">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* SIDEBAR */}
                    <div className="w-full md:w-64 shrink-0">
                        <CategorySidebar
                            onSelectSubCategory={handleSelectSubCategory}
                            onSelectBrand={handleSelectBrand}
                            onClearFilters={handleClearFilters}
                        />
                    </div>

                    {/* PRODUCTOS */}
                    <div className="flex-1 flex flex-col gap-6">
                        {filteredProducts.length === 0 ? (
                            <p className="text-gray-500">
                                No hay productos que coincidan con la selección
                            </p>
                        ) : (
                            <>
                                {/* GRID */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {currentProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>

                                {/* PAGINACIÓN */}
                                <Pagination
                                    totalItems={filteredProducts.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
