import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from "flowbite-react";
import {
    PencilIcon,
    TrashIcon,
    ArrowUpIcon,
    EyeIcon,
} from "@heroicons/react/20/solid";
import { Sale } from "@/types/sale.types";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { SaleDetailsModal } from "@/components/SaleDetailsModal";

type SortColumn = keyof Sale | "client.name";

interface SalesTableProps {
    sales: Sale[];
    onDelete: (Sale: Sale) => void;
}

const SALE_STATUS_MAP: Record<string, { label: string; style: string }> = {
    PENDING: {
        label: "Pendiente",
        style: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    IN_PROGRESS: {
        label: "En curso",
        style: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
    COMPLETED: {
        label: "Completada",
        style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    CANCELLED: {
        label: "Cancelada",
        style: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
};

export function SalesTable({ sales, onDelete }: SalesTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const formatARS = useMemo(
        () =>
            new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
            }),
        [],
    );

    const handleOpenDetails = (sale: Sale) => {
        setSelectedSale(sale);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsModalOpen(false);
        setSelectedSale(null);
    };

    const handleSort = (column: SortColumn) => {
        if (sortColumn !== column) {
            setSortColumn(column);
            setSortDirection("asc");
        } else if (sortDirection === "asc") {
            setSortDirection("desc");
        } else {
            setSortColumn(null);
            setSortDirection("asc");
        }
    };

    const renderSortArrow = (column: SortColumn) => {
        const isActive = sortColumn === column;
        return (
            <ArrowUpIcon
                className={`w-3 h-3 ms-1 transition-all duration-150 ${isActive
                        ? sortDirection === "desc"
                            ? "rotate-180 opacity-100"
                            : "opacity-100"
                        : "opacity-0"
                    }`}
            />
        );
    };

    const sortedSales = useMemo(() => {
        if (!sortColumn) return sales;

        return [...sales].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortColumn === "status") {
                aValue = SALE_STATUS_MAP[a.status]?.label || a.status;
                bValue = SALE_STATUS_MAP[b.status]?.label || b.status;
            } else if (sortColumn === "total") {
                aValue = a.total ?? 0;
                bValue = b.total ?? 0;
            } else if (sortColumn === "client.name") {
                aValue = a.client?.name || "";
                bValue = b.client?.name || "";
            } else {
                aValue = a[sortColumn as keyof Sale];
                bValue = b[sortColumn as keyof Sale];
            }

            if (sortColumn === "id" || typeof aValue === "number") {
                return sortDirection === "asc"
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
            if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [sales, sortColumn, sortDirection]);

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table hoverable>
                <TableHead>
                    <TableRow>
                        <TableHeadCell
                            className="px-4 w-14 cursor-pointer select-none"
                            onClick={() => handleSort("id")}
                        >
                            <div className="flex items-center">
                                # {renderSortArrow("id")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer select-none"
                            onClick={() => handleSort("createdAt")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Fecha</span>
                                <div className="absolute translate-x-8">
                                    {renderSortArrow("createdAt")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="cursor-pointer select-none"
                            onClick={() => handleSort("status")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Estado</span>
                                <div className="absolute translate-x-8">
                                    {renderSortArrow("status")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer select-none"
                            onClick={() => handleSort("total")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Monto</span>
                                <div className="absolute translate-x-8">
                                    {renderSortArrow("total")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer select-none"
                            onClick={() => handleSort("client.name")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Cliente</span>
                                <div className="absolute translate-x-8">
                                    {renderSortArrow("client.name")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell className="select-none text-center">
                            Acciones
                        </TableHeadCell>
                    </TableRow>
                </TableHead>

                <TableBody className="divide-y">
                    {sortedSales.map((sale, index) => (
                        <TableRow
                            key={sale.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800 text-sm md:text-base"
                        >
                            <TableCell className="px-4 text-gray-500 font-medium">
                                {index + 1}
                            </TableCell>

                            <TableCell className="hidden md:table-cell! text-center text-gray-600 dark:text-gray-400">
                                {sale.createdAt
                                    ? new Date(
                                        sale.createdAt,
                                    ).toLocaleDateString("es-AR")
                                    : "---"}
                            </TableCell>

                            <TableCell className="text-center">
                                {(() => {
                                    const statusInfo = SALE_STATUS_MAP[
                                        sale.status
                                    ] || {
                                        label: sale.status,
                                        style: "bg-gray-500/10 text-gray-400 border-gray-500/20",
                                    };
                                    return (
                                        <span
                                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusInfo.style}`}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    );
                                })()}
                            </TableCell>

                            {/* Monto: Alineado a la derecha con padding derecho */}
                            <TableCell className="hidden md:table-cell! text-right font-mono text-gray-900 dark:text-white">
                                <div className="xl:pr-20!">
                                    {formatARS.format(sale.total ?? 0)}
                                </div>
                            </TableCell>

                            {/* Cliente: Alineado a la izquierda con padding izquierdo */}
                            <TableCell className="hidden md:table-cell! text-left">
                                <div className="xl:pl-20!">
                                    {sale.client ? (
                                        `${sale.client.surname}, ${sale.client.name}`
                                    ) : (
                                        <span className="text-gray-400 italic text-xs">
                                            Sin cliente
                                        </span>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        title="Ver detalles"
                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition active:scale-95 cursor-pointer"
                                        onClick={() => handleOpenDetails(sale)}
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                    {sale.status !== "CANCELLED" ? (
                                        <Link
                                            to={ROUTES.sales.edit(sale.id)}
                                            title="Editar venta"
                                            className="text-blue-500 hover:text-blue-400 transition active:scale-95 cursor-pointer"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </Link>
                                    ) : (
                                        <div
                                            title="No se puede editar una venta cancelada"
                                            className="text-gray-400 cursor-not-allowed"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                    <button
                                        title={
                                            sale.status === "CANCELLED"
                                                ? "Venta ya cancelada"
                                                : "Cancelar venta"
                                        }
                                        className={`${sale.status === "CANCELLED"
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-red-500 hover:text-red-400 transition active:scale-95 cursor-pointer"
                                            }`}
                                        onClick={() =>
                                            sale.status !== "CANCELLED" &&
                                            onDelete(sale)
                                        }
                                        disabled={sale.status === "CANCELLED"}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <SaleDetailsModal
                isOpen={isDetailsModalOpen}
                sale={selectedSale}
                onClose={handleCloseDetails}
            />
        </div>
    );
}
