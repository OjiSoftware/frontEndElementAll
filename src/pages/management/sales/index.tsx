import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { SalesTable } from "@/components/SalesTable";
import Pagination from "@/components/PaginationManagement";
import { Sale } from "@/types/sale.types";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import SearchBar from "../../../components/SearchBar";
import { saleApi } from "@/services/SaleService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useDisableSale } from "@/hooks/useDisableSale";
import { PlusIcon } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function SalesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [sales, setSales] = useState<Sale[]>([]);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

    // Estado inicial null para permitir el estado "Neutral"
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
        null,
    );

    const navigate = useNavigate();
    const itemsPerPage = useItemsPerpage();
    const { disableSale, loading } = useDisableSale(setSales);

    const filteredSales = useMemo(() => {
        const searchTerm = query.trim().toLowerCase();

        // 1. Filtrar
        const filtered = sales.filter((s) => {
            const matchesQuery =
                s.id.toString().includes(searchTerm) ||
                s.client?.name?.toLowerCase().includes(searchTerm);
            return s.status && matchesQuery;
        });

        // 2. ASIGNAR POSICIÓN ORIGINAL (Aquí está el truco)
        // Agregamos el índice original a cada objeto para que "viva" en él
        const salesWithIndex = filtered.map((sale, index) => ({
            ...sale,
            originalIndex: index + 1, // Este será nuestro número de fila real
        }));

        if (!sortColumn || !sortDirection) {
            return salesWithIndex;
        }

        // 3. Ordenar
        return [...salesWithIndex].sort((a, b) => {
            let aVal: any;
            let bVal: any;

            if (sortColumn === "rowNum") {
                aVal = a.originalIndex;
                bVal = b.originalIndex;
            } else if (sortColumn === "client.name") {
                aVal = a.client?.name || "";
                bVal = b.client?.name || "";
            } else {
                aVal = a[sortColumn as keyof Sale] ?? "";
                bVal = b[sortColumn as keyof Sale] ?? "";
            }

            // Comparación
            if (
                sortColumn === "rowNum" ||
                sortColumn === "total" ||
                typeof aVal === "number"
            ) {
                return sortDirection === "asc"
                    ? Number(aVal) - Number(bVal)
                    : Number(bVal) - Number(aVal);
            }

            return sortDirection === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [sales, query, sortColumn, sortDirection]);

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

    // Función handleSort: Asc -> Desc -> Neutral
    const handleSort = (col: string) => {
        if (sortColumn === col) {
            if (sortDirection === "asc") {
                setSortDirection("desc");
            } else if (sortDirection === "desc") {
                setSortColumn(null);
                setSortDirection(null);
            }
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    return (
        <DashboardLayout
            title="Lista de ventas"
            subtitle="Gestión de ventas generadas en el sistema."
            actions={
                <button
                    onClick={() => navigate(ROUTES.sales.create)}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-500 text-white font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
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
                    inputClassName="bg-transparent text-white border-white/10 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-xl h-11"
                    iconClassName="text-slate-500 group-focus-within:text-indigo-400"
                />

                <SalesTable
                    sales={currentSales}
                    onDelete={(sale) => setSaleToDelete(sale)}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onSort={handleSort}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                />

                <Pagination
                    totalItems={filteredSales.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />

                {saleToDelete && (
                    <ConfirmModal
                        isOpen={true}
                        title="Confirmar cancelación"
                        variant="danger"
                        message={
                            <span>
                                ¿Estás seguro de que querés cancelar la{" "}
                                <b>Venta #{saleToDelete.id}</b>? Esta acción no
                                se puede deshacer.
                            </span>
                        }
                        isLoading={loading}
                        onCancel={() => setSaleToDelete(null)}
                        onConfirm={async () => {
                            await disableSale(saleToDelete.id);
                            if (currentSales.length === 1 && currentPage > 1) {
                                setCurrentPage((prev) => prev - 1);
                            }
                            setSaleToDelete(null);
                        }}
                        confirmText="Confirmar"
                        cancelText="Volver"
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
