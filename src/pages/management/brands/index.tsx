import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Pagination from "@/components/PaginationManagement";
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
            subtitle="Gestión de marcas del sistema."
            actions={
                <button
                    onClick={() => navigate(ROUTES.brands.create)}
                    className="px-3 py-3 text-sm rounded-lg bg-indigo-600 text-white font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    title="Crear nuevo producto"
                >
                    <span className="md:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                        >
                            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                            <path d="M9 15h6" />
                            <path d="M12 18v-6" />
                        </svg>
                    </span>
                    <span className="hidden md:inline">+ Nueva marca</span>{" "}
                </button>
            }
        >
            <div className="space-y-4">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Buscar marcas"
                    containerClassName="max-w-full"
                    inputClassName="
                      bg-gray-900
                      text-white
                      border-gray-700
                      placeholder-gray-500
                      focus:ring-indigo-500
                    "
                    iconClassName="text-gray-400"
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
