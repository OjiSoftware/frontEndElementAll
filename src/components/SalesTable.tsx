import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from "flowbite-react";
import { PencilIcon, TrashIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { Sale } from "@/types/sale.types";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";


type SortColumn = keyof Sale | "client.name" ;

interface SalesTableProps {
    sales: Sale[];
    onDelete: (Sale: Sale) => void;
}

export function SalesTable({ sales, onDelete }: SalesTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // ---------------- Sort ----------------
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
                aria-label={`Ordenar por ${column}`}
                className={`w-3 h-3 ms-1 inline-block text-gray-400 transition-all duration-150 ${isActive
                    ? sortDirection === "desc"
                        ? "rotate-180 opacity-100"
                        : "opacity-100"
                    : "opacity-0"
                    }`}
            />
        );
    };

    // ---------------- Sorted Products ----------------
    const sortedSales = useMemo(() => {

/*         const filtered = sales.filter(s => s.status !== "CANCELLED"); */

        if (!sortColumn) return sales;

        return [...sales].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortColumn === "status") {
                aValue = a.status || "";
                bValue = b.status || "";
            } else if (sortColumn === "total") {
                aValue = a.total || "";
                bValue = b.total || "";
            } else if (sortColumn === "client.name") {
                aValue = a.client?.name || "";
                bValue = b.client?.name || "";
            }else {
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
                            <div className="flex items-center gap-1">
                                # {renderSortArrow("id")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer"
                            onClick={() =>
                                handleSort("createdAt")
                            }
                        >
                            <div className="flex items-center gap-1">
                                Fecha{" "}
                                {renderSortArrow("createdAt")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="cursor-pointer"
                            onClick={() => handleSort("status")}
                        >
                            <div className="flex items-center gap-1">
                                Estado {renderSortArrow("status")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer"
                            onClick={() => handleSort("total")}
                        >
                            <div className="flex items-center gap-1">
                                Monto total {renderSortArrow("total")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer"
                            onClick={() => handleSort("client.name")}
                        >
                            <div className="flex items-center gap-1">
                                Cliente {renderSortArrow("client.name")}
                            </div>
                        </TableHeadCell>
                        
                        <TableHeadCell className="select-none">
                            Acciones
                        </TableHeadCell>

                    </TableRow>
                </TableHead>

                <TableBody className="divide-y">
                    {sortedSales.map((sales, index) => (
                        <TableRow
                            key={sales.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            {/* Solo número de fila */}
                            <TableCell className="px-4 text-gray-500">
                                {index + 1}
                            </TableCell>

                            <TableCell className="hidden md:table-cell!">
                                {sales.createdAt 
                                  ? new Date(sales.createdAt).toLocaleDateString('es-AR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })
                                  : "Sin fecha"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {sales.status}
                            </TableCell>
                            <TableCell className="hidden md:table-cell!">
                                {"$" +sales.total}
                            </TableCell>
                            <TableCell className="hidden md:table-cell!">
                                {sales.client?.surname + ", " + sales.client?.name || "sin cliente" }
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={ROUTES.sales.edit(sales.id)}
                                        title="Editar venta"
                                        className="text-blue-500 hover:text-blue-400 transition cursor-pointer"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button
                                        title="Eliminar venta"
                                        className="text-red-500 hover:text-red-400 transition cursor-pointer"
                                        onClick={() => onDelete(sales)}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </TableCell>

                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}