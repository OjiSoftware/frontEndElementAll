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
import { PlusIcon } from "lucide-react";

export default function BrandsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const navigate = useNavigate();
    const itemsPerPage = useItemsPerpage();
    const { disableBrand, loading } = useDisableBrand(setBrands);

    // ---------------- Filtrado ----------------
    const filteredBrands = brands.filter((b) => {
        const isActive = b.status !== false;
        const matchesQuery = b.name
            .toLowerCase()
            .includes(query.trim().toLowerCase());

        return isActive && matchesQuery;
    });

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
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
                >
                    <PlusIcon size={18} />
                    <span className="hidden md:inline">Nueva marca</span>
                </button>
            }
        >
            <div className="space-y-4">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Buscar por nombre de la marca..."
                    containerClassName="max-w-full"
                    inputClassName="
                    bg-transparent
                    text-white
                    border-white/10
                    placeholder:text-slate-500
                    focus:border-indigo-500
                    focus:ring-1
                    focus:ring-indigo-500
                    transition-all
                    rounded-xl
                    h-11
                  "
                    iconClassName="text-slate-500 group-focus-within:text-indigo-400"
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
