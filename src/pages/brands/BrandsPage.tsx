import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { BrandsTable } from "@/components/BrandsTable";
import { Brand } from "@/types/brand.types";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import { useDisableBrand } from "@/hooks/useDisableBrand";
import { brandApi } from "@/services/BrandService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export default function BrandsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const navigate = useNavigate();
    const itemsPerPage = useItemsPerpage();
    const { disableBrand, loading } = useDisableBrand(setBrands);

    // ---------------- Filtrado ----------------
    const filteredBrands = brands
        .filter((b) => b.status !== false) // solo marcas activas
        .filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));

    // ---------------- Paginación ----------------
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentBrands = filteredBrands.slice(firstIndex, lastIndex);

    // ---------------- Fetch ----------------
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await brandApi.getAll();
                setBrands(data);
            } catch (error) {
                console.error("Error cargando marcas", error);
            }
        };
        fetchBrands();
    }, []);

    useEffect(() => setCurrentPage(1), [itemsPerPage, query]);

    return (
        <DashboardLayout
            title="Lista de marcas"
            subtitle="Gestión de marcas del sistema"
            actions={
                <button
                    onClick={() => navigate(ROUTES.brands.create)}
                    className="px-4 py-3 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all duration-300 cursor-pointer"
                >
                    + Nueva marca
                </button>
            }
        >
            <div className="space-y-4">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Buscar marcas"
                />

                <BrandsTable
                    brands={currentBrands}
                    onDelete={(brand) => setBrandToDelete(brand)}
                />

                <Pagination
                    totalItems={filteredBrands.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />

                {brandToDelete && (
                    <ConfirmDeleteModal
                        isOpen={true}
                        itemName={brandToDelete.name}
                        isLoading={loading}
                        onCancel={() => setBrandToDelete(null)}
                        onConfirm={async () => {
                            await disableBrand(brandToDelete.id);

                            // Ajustamos página si la última marca desaparece de la vista
                            if (currentBrands.length === 1 && currentPage > 1) {
                                setCurrentPage((prev) => prev - 1);
                            }

                            setBrandToDelete(null);
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
