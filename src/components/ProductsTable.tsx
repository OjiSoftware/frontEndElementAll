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
import { Product } from "@/types/product.types";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CheckCircle } from "lucide-react";

type SortColumn = keyof Product | "brand.name" | "subCategory.category.name";

interface ProductsTableProps {
    products: Product[];
    onDelete: (product: Product) => void;
}

export function ProductsTable({ products, onDelete }: ProductsTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Formateador ARS
    const formatARS = useMemo(
        () =>
            new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
            }),
        [],
    );

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
    const sortedProducts = useMemo(() => {
        if (!sortColumn) return products;

        return [...products].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortColumn === "brand.name") {
                aValue = a.brand?.name || "";
                bValue = b.brand?.name || "";
            } else if (sortColumn === "subCategory.category.name") {
                aValue = a.subCategory?.category?.name || "";
                bValue = b.subCategory?.category?.name || "";
            } else {
                aValue = a[sortColumn as keyof Product];
                bValue = b[sortColumn as keyof Product];
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
    }, [products, sortColumn, sortDirection]);

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
                            className="cursor-pointer"
                            onClick={() => handleSort("name")}
                        >
                            <div className="flex items-center gap-1">
                                Nombre {renderSortArrow("name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer"
                            onClick={() => handleSort("brand.name")}
                        >
                            <div className="flex items-center gap-1">
                                Marca {renderSortArrow("brand.name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer"
                            onClick={() =>
                                handleSort("subCategory.category.name")
                            }
                        >
                            <div className="flex items-center gap-1">
                                Categoria{" "}
                                {renderSortArrow("subCategory.category.name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className="hidden md:table-cell! cursor-pointer"
                            onClick={() => handleSort("price")}
                        >
                            <div className="flex items-center gap-1">
                                Precio {renderSortArrow("price")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell className="select-none">
                            Acciones
                        </TableHeadCell>

                        <TableHeadCell className="">
                            Cat.
                        </TableHeadCell>
                    </TableRow>
                </TableHead>

                <TableBody className="divide-y">
                    {sortedProducts.map((product, index) => (
                        <TableRow
                            key={product.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            {/* Solo número de fila */}
                            <TableCell className="px-4 text-gray-500">
                                {index + 1}
                            </TableCell>

                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {product.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell!">
                                {product.brand?.name || "sin marca"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell!">
                                {product.subCategory?.category?.name ||
                                    "sin categoria"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell!">
                                {formatARS.format(product.price)}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={ROUTES.products.edit(product.id)}
                                        title="Editar producto"
                                        className="text-blue-500 hover:text-blue-400 transition cursor-pointer"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button
                                        title="Eliminar producto"
                                        className="text-red-500 hover:text-red-400 transition cursor-pointer"
                                        onClick={() => onDelete(product)}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-center">

                                    {product.showingInCatalog && (<CheckCircle className="w-5 h-5 text-green-500" />)}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
