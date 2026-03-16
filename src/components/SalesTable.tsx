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

// Actualizamos el tipo para incluir rowNum (la posición visual)
type SortColumn = keyof Sale | "client.name" | "rowNum";

interface SalesTableProps {
    sales: Sale[];
    onDelete: (Sale: Sale) => void;
    currentPage: number;
    itemsPerPage: number;
    // Props actualizadas para aceptar null (Estado Neutral)
    onSort: (column: string) => void;
    currentSortColumn: string | null;
    currentSortDirection: "asc" | "desc" | null;
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

export function SalesTable({
    sales,
    onDelete,
    currentPage,
    itemsPerPage,
    onSort,
    currentSortColumn,
    currentSortDirection,
}: SalesTableProps) {
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

    // Ahora solo avisamos al padre qué columna se clickeó
    const handleSort = (column: SortColumn) => {
        onSort(column as string);
    };

    const renderSortArrow = (column: SortColumn) => {
        const isActive = currentSortColumn === column;
        return (
            <ArrowUpIcon
                className={`w-3 h-3 ms-1 transition-all duration-150 ${
                    isActive && currentSortDirection
                        ? currentSortDirection === "desc"
                            ? "rotate-180 opacity-100"
                            : "opacity-100"
                        : "opacity-0"
                }`}
            />
        );
    };

    const displaySales = useMemo(() => {
        return sales;
    }, [sales]);

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table hoverable>
                <TableHead>
                    <TableRow>
                        <TableHeadCell
                            className="px-4 w-14 cursor-pointer select-none"
                            // Cambiado a rowNum para que el orden visual sea correcto
                            onClick={() => handleSort("rowNum")}
                        >
                            <div className="flex items-center">
                                # {renderSortArrow("rowNum")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer select-none text-center"
                            onClick={() => handleSort("createdAt")}
                        >
                            <div className="relative inline-flex items-center justify-center">
                                <span>Fecha</span>
                                <div className="absolute -right-6">
                                    {renderSortArrow("createdAt")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="cursor-pointer select-none text-center"
                            onClick={() => handleSort("status")}
                        >
                            <div className="relative inline-flex items-center justify-center">
                                <span>Estado</span>
                                <div className="absolute -right-6">
                                    {renderSortArrow("status")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer select-none text-center"
                            onClick={() => handleSort("total")}
                        >
                            <div className="relative inline-flex items-center justify-center">
                                <span>Monto</span>
                                <div className="absolute -right-6">
                                    {renderSortArrow("total")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer select-none text-center"
                            onClick={() => handleSort("client.name")}
                        >
                            <div className="relative inline-flex items-center justify-center">
                                <span>Cliente</span>
                                <div className="absolute -right-6">
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
                    {displaySales.map((sale) => (
                        <TableRow
                            key={sale.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800 text-sm md:text-base"
                        >
                            <TableCell className="px-4 md:font-bold align-top py-4 lg:align-middle">
                                <div className="flex flex-col">
                                    <span className="text-gray-900 dark:text-white">
                                        {(sale as any).originalIndex}
                                    </span>
                                    <span className="sm:hidden text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                                        {formatARS.format(
                                            Number(sale.total) ?? 0,
                                        )}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="hidden md:table-cell! text-center text-gray-600 dark:text-gray-400 align-top py-4 lg:align-middle">
                                {sale.createdAt
                                    ? new Date(
                                          sale.createdAt,
                                      ).toLocaleDateString("es-AR")
                                    : "---"}
                            </TableCell>

                            <TableCell className="text-center align-middle md:align-top py-4 lg:align-middle">
                                {(() => {
                                    const statusInfo = SALE_STATUS_MAP[
                                        sale.status
                                    ] || {
                                        label: sale.status,
                                        style: "bg-gray-500/10 text-gray-400 border-gray-500/20",
                                    };
                                    return (
                                        <span
                                            className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold border inline-block uppercase tracking-wider ${statusInfo.style}`}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    );
                                })()}
                            </TableCell>

                            <TableCell className="hidden md:table-cell! text-center font-mono text-gray-900 dark:text-white align-top py-4 lg:align-middle">
                                {formatARS.format(Number(sale.total) ?? 0)}
                            </TableCell>

                            <TableCell className="hidden md:table-cell! text-gray-600 dark:text-gray-400 align-top py-4">
                                {sale.client ? (
                                    `${sale.client.surname}, ${sale.client.name}`
                                ) : (
                                    <span className="text-gray-400 italic text-xs">
                                        Sin cliente
                                    </span>
                                )}
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
                                    <Link
                                        to={ROUTES.sales.edit(sale.id)}
                                        className={
                                            sale.status === "CANCELLED"
                                                ? "text-gray-400 cursor-not-allowed pointer-events-none"
                                                : "text-blue-500 hover:text-blue-400 transition active:scale-95 cursor-pointer"
                                        }
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button
                                        className={
                                            sale.status === "CANCELLED"
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-red-500 hover:text-red-400 transition active:scale-95 cursor-pointer"
                                        }
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
