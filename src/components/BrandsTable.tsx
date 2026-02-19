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
import { Brand } from "@/types/brand.types";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

type SortColumn = keyof Brand | "subCategory.name";

interface BrandsTableProps {
    brands: Brand[];
    onDelete: (brand: Brand) => void;
}

export function BrandsTable({ brands, onDelete }: BrandsTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
                className={`w-3 h-3 ms-1 inline-block text-gray-400 transition-all duration-150 ${
                    isActive
                        ? sortDirection === "desc"
                            ? "rotate-180 opacity-100"
                            : "opacity-100"
                        : "opacity-0"
                }`}
            />
        );
    };

    const sortedBrands = useMemo(() => {
        if (!sortColumn) return brands;

        return [...brands].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortColumn === "subCategory.name") {
                aValue = a.subCategory?.name || "";
                bValue = b.subCategory?.name || "";
            } else {
                aValue = a[sortColumn as keyof Brand];
                bValue = b[sortColumn as keyof Brand];
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
    }, [brands, sortColumn, sortDirection]);

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
                            className="cursor-pointer select-none"
                            onClick={() => handleSort("name")}
                        >
                            <div className="flex items-center gap-1">
                                Nombre {renderSortArrow("name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer select-none"
                            onClick={() => handleSort("subCategory.name")}
                        >
                            <div className="flex items-center gap-1">
                                Subcategoría{" "}
                                {renderSortArrow("subCategory.name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell className="select-none">
                            Acciones
                        </TableHeadCell>
                    </TableRow>
                </TableHead>

                <TableBody className="divide-y">
                    {sortedBrands.map((brand, index) => (
                        <TableRow
                            key={brand.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <TableCell className="px-4 text-gray-500">
                                {index + 1}
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {brand.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell!">
                                {brand.subCategory?.name || "sin subcategoría"}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={ROUTES.brands.edit(brand.id)}
                                        title="Editar marca"
                                        className="text-blue-500 hover:text-blue-400 transition cursor-pointer"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button
                                        title="Eliminar marca"
                                        className="text-red-500 hover:text-red-400 transition cursor-pointer"
                                        onClick={() => onDelete(brand)}
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
