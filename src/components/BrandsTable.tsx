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

    // ---------------- Class constants ----------------
    const thClasses = "px-2 py-3 md:px-4 select-none";
    const tdBase = "px-2 py-3 md:px-4";
    const hiddenOnMobile = "hidden md:table-cell!";
    const flexTh = "flex items-center";
    const flexTdIcons = "flex justify-center items-center gap-3";

    // ---------------- Column widths ----------------
    const colWidths = {
        id: "w-1/5 md:w-1/6! lg:w-1/12!",
        name: "w-1/2 md:w-1/4!",
        subCategory: "w-1/4",
        actions: "w-28",
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table hoverable className="table-fixed">
                <TableHead>
                    <TableRow>
                        <TableHeadCell
                            className={`${thClasses} ${colWidths.id} cursor-pointer`}
                            onClick={() => handleSort("id")}
                        >
                            <div className={flexTh}>
                                # {renderSortArrow("id")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.name} cursor-pointer`}
                            onClick={() => handleSort("name")}
                        >
                            <div className={flexTh}>
                                Nombre {renderSortArrow("name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.subCategory} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() => handleSort("subCategory.name")}
                        >
                            <div className={flexTh}>
                                Subcategoría{" "}
                                {renderSortArrow("subCategory.name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.actions}`}
                        >
                            <div className={`${flexTh} justify-center`}>
                                Acciones
                            </div>
                        </TableHeadCell>
                    </TableRow>
                </TableHead>

                <TableBody className="divide-y">
                    {sortedBrands.map((brand, index) => (
                        <TableRow
                            key={brand.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <TableCell
                                className={`${tdBase} ${colWidths.id} text-gray-500`}
                            >
                                {index + 1}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.name} text-gray-900 dark:text-white`}
                            >
                                {brand.name}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.subCategory} ${hiddenOnMobile}`}
                            >
                                {brand.subCategory?.name || "Sin subcategoría"}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.actions}`}
                            >
                                <div className={flexTdIcons}>
                                    <Link
                                        to={ROUTES.brands.edit(brand.id)}
                                        title="Editar marca"
                                        className="text-blue-500 hover:text-blue-400 transition"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button
                                        title="Eliminar marca"
                                        className="text-red-500 hover:text-red-400 transition"
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
