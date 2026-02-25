import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { SalesTable } from "@/components/SalesTable";
import Pagination from "@/components/PaginationManagement";
import { Sale } from "@/types/sale.types";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import SearchBar from "../../components/SearchBar";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { saleApi } from "@/services/SaleService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useDisableSale }  from "@/hooks/useDisableSale";

export default function SalesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [sales, setSales] = useState<Sale[]>([]);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
    const navigate = useNavigate();
    const itemsPerPage = useItemsPerpage();
    const { disableSale, loading } = useDisableSale(setSales);

    // ---------------- Filtrado ----------------
    const filteredSales = sales
        .filter((s) => s.status);

    // ---------------- Paginación ----------------
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentSales = filteredSales.slice(firstIndex, lastIndex);

    // ---------------- Fetch ----------------
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await saleApi.getAllSales();
                setSales(data);
            } catch (error) {
                console.error("Error cargando ventas", error);
            }
        };
        fetchSales();
    }, []);

    // Resetear página al cambiar itemsPerPage o query
    useEffect(() => setCurrentPage(1), [itemsPerPage, query]);

    return (
        <DashboardLayout
            title="Lista de ventas"
            subtitle="Gestión de ventas generadas en el sistema."
            actions={
                <button
                    onClick={() => navigate(ROUTES.sales.create)}
                    className="flex-1 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                >
                    + Nueva venta
                </button>
            }
        >
            <div className="space-y-4">
                {/* SEARCH BAR */}
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

                {/* PRODUCTS TABLE */}
                <SalesTable
                    sales={currentSales}
                    onDelete={(sales) => setSaleToDelete(sales)}
                />

                {/* PAGINATION */}
                <Pagination
                    totalItems={filteredSales.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />

                {/* MODAL DE CONFIRMACIÓN */}
                {saleToDelete && (
                    <ConfirmDeleteModal
                        isOpen={true}
                        itemName={`Venta #${saleToDelete.id}`}
                        isLoading={loading}
                        onCancel={() => setSaleToDelete(null)}
                        onConfirm={async () => {
                            await disableSale(saleToDelete.id);

                            if (
                                currentSales.length === 1 &&
                                currentPage > 1
                            ) {
                                setCurrentPage((prev) => prev - 1);
                            }

                            setSaleToDelete(null);
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
