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

    const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
    const [selectedCatName, setSelectedCatName] = useState<string | null>(null);
    const [selectedSubCatName, setSelectedSubCatName] = useState<string | null>(null);
    const [selectedBrandName, setSelectedBrandName] = useState<string | null>(null);

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

    // ---------------- BUSQUEDA Y FILTROS ----------------
    useEffect(() => {
        let filtered = catProducts;

        if (search.trim() !== "") {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        if (selectedSubCategory !== null) {
            filtered = filtered.filter((p) => Number(p.subCategoryId) === selectedSubCategory);
        }

        if (selectedBrand !== null) {
            filtered = filtered.filter((p) => Number(p.brandId) === selectedBrand);
        }

        setFilteredProducts(filtered);
    }, [search, selectedSubCategory, selectedBrand, catProducts]);

    // ---------------- HANDLERS DE FILTROS ----------------
    const handleSelectSubCategory = (subId: number, subName: string, catName: string) => {
        setSelectedSubCategory(subId);
        setSelectedSubCatName(subName);
        setSelectedCatName(catName);
    };

    const handleSelectBrand = (brandId: number, brandName: string) => {
        setSelectedBrand(brandId);
        setSelectedBrandName(brandName);
    };

    const handleClearFilters = () => {
        setSelectedSubCategory(null);
        setSelectedSubCatName(null);
        setSelectedCatName(null);
        setSelectedBrand(null);
        setSelectedBrandName(null);
        setSearch("");
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
        <div className="flex flex-col min-h-screen w-full bg-[#f1f3f5]">
            {/* Navbar con búsqueda */}
            <Navbar search={search} setSearch={setSearch} />

            <div className="w-full max-[1187px]:px-4 max-w-[1187px] mx-auto py-8 flex-grow">
                {/* BREADCRUMBS */}
                <div className="text-[#a0a0a0] text-sm font-lato mb-4 flex items-center gap-1.5 flex-wrap">
                    <span className="hover:text-gray-600 cursor-pointer transition-colors" onClick={handleClearFilters}>ElementAll</span>
                    {(selectedCatName || selectedBrandName) && <span>/</span>}
                    {selectedCatName && (
                        <>
                            <span className="cursor-default">{selectedCatName}</span>
                            <span>/</span>
                            <span className="cursor-default font-semibold text-gray-500">{selectedSubCatName}</span>
                        </>
                    )}
                    {selectedCatName && selectedBrandName && <span>/</span>}
                    {selectedBrandName && (
                        <span className="cursor-default font-semibold text-gray-500">{selectedBrandName}</span>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* SIDEBAR */}
                    <div className="w-full md:w-64 shrink-0">
                        <CategorySidebar
                            onSelectSubCategory={handleSelectSubCategory}
                            onSelectBrand={handleSelectBrand}
                            onClearFilters={handleClearFilters}
                            selectedSubCategory={selectedSubCategory}
                            selectedBrand={selectedBrand}
                        />
                    </div>
                    {/* PRODUCTOS */}
                    <div className="flex-1 flex flex-col gap-6">
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex items-center justify-center">
                                <p className="text-gray-500 text-lg font-poppins text-center">
                                    No hay productos que coincidan con la selección
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Contenedor Blanco para los Productos */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 w-full h-fit">
                                    {/* GRID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {currentProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* PAGINACIÓN (Fuera del contenedor blanco) */}
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
