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

    // ---------------- Class constants ----------------
    const thClasses = "px-2 py-3 md:px-4 select-none";
    const tdBase = "px-2 py-3 md:px-4";
    const hiddenOnMobile = "hidden md:table-cell!";
    const flexTh = "flex items-center";
    const flexTdIcons = "flex justify-center items-center gap-2 lg:gap-3!";

    // ---------------- Column widths para table-fixed ----------------
    const colWidths = {
        id: "w-1/5 md:w-1/6! lg:w-1/12!",
        name: "w-1/2 md:w-1/3!",
        brand: "w-1/4",
        category: "w-1/3",
        price: "w-1/3 md:w-1/3",
        actions: "w-20 lg:w-28!",
        catalog: "w-28 md:w-32!",
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
                            className={`${thClasses} ${colWidths.brand} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() => handleSort("brand.name")}
                        >
                            <div className={flexTh}>
                                Marca {renderSortArrow("brand.name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.category} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() =>
                                handleSort("subCategory.category.name")
                            }
                        >
                            <div className={flexTh}>
                                Categoría{" "}
                                {renderSortArrow("subCategory.category.name")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.price} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() => handleSort("price")}
                        >
                            <div className={`${flexTh}`}>
                                Precio {renderSortArrow("price")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.actions}`}
                        >
                            <div className={`${flexTh} justify-center`}>
                                Acciones
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.catalog} cursor-pointer relative`}
                            onClick={() => handleSort("showingInCatalog")}
                        >
                            <span className="block text-center w-full">
                                Catálogo
                            </span>
                            <ArrowUpIcon
                                className={`absolute right-2 md:right-3! top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 transition-transform duration-150 ${
                                    sortColumn === "showingInCatalog"
                                        ? sortDirection === "desc"
                                            ? "rotate-180 opacity-100"
                                            : "opacity-100"
                                        : "opacity-0"
                                }`}
                            />
                        </TableHeadCell>
                    </TableRow>
                </TableHead>

                <TableBody className="divide-y">
                    {sortedProducts.map((product, index) => (
                        <TableRow
                            key={product.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <TableCell
                                className={`${tdBase} ${colWidths.id} text-gray-500`}
                            >
                                { index + 1}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.name} text-gray-900 dark:text-white`}
                            >
                                {product.name}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.brand} ${hiddenOnMobile}`}
                            >
                                {product.brand?.name || "Sin marca"}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.category} ${hiddenOnMobile}`}
                            >
                                {product.subCategory?.category?.name ||
                                    "Sin categoría"}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.price} ${hiddenOnMobile}`}
                            >
                                {formatARS.format(product.price)}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.actions}`}
                            >
                                <div className={flexTdIcons}>
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

                            <TableCell
                                className={`${tdBase} ${colWidths.catalog}`}
                            >
                                <div className={flexTdIcons}>
                                    {product.showingInCatalog && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
