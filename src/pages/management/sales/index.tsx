import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { SalesTable } from "@/components/SalesTable";
import Pagination from "@/components/PaginationManagement";
import { Sale } from "@/types/sale.types";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import SearchBar from "../../../components/SearchBar";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { saleApi } from "@/services/SaleService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useDisableSale } from "@/hooks/useDisableSale";
import { PlusIcon } from "lucide-react";

export default function SalesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [sales, setSales] = useState<Sale[]>([]);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
    const navigate = useNavigate();
    const itemsPerPage = useItemsPerpage();
    const { disableSale, loading } = useDisableSale(setSales);

    const filteredSales = sales.filter((s) => {
        const matchesStatus = s.status;
        const searchTerm = query.trim().toLowerCase();

        const matchesQuery =
            s.id.toString().includes(searchTerm) ||
            s.client?.name?.toLowerCase().includes(searchTerm);

        return matchesStatus && matchesQuery;
    });

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentSales = filteredSales.slice(firstIndex, lastIndex);

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

    useEffect(() => setCurrentPage(1), [itemsPerPage, query]);

    return (
        <DashboardLayout
            title="Lista de ventas"
            subtitle="Gestión de ventas generadas en el sistema."
            actions={
                <button
                    onClick={() => navigate(ROUTES.sales.create)}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
                >
                    <PlusIcon size={18} />
                    <span className="hidden md:inline">Nueva venta</span>
                </button>
            }
        >
            <div className="space-y-6">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Buscar por ID o nombre del cliente..."
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

                <SalesTable
                    sales={currentSales}
                    onDelete={(sales) => setSaleToDelete(sales)}
                />

                <Pagination
                    totalItems={filteredSales.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />

                {saleToDelete && (
                    <ConfirmDeleteModal
                        isOpen={true}
                        itemName={`Venta #${saleToDelete.id}`}
                        isLoading={loading}
                        onCancel={() => setSaleToDelete(null)}
                        onConfirm={async () => {
                            await disableSale(saleToDelete.id);
                            if (currentSales.length === 1 && currentPage > 1) {
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
