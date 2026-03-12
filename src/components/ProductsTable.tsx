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

// 🔥 1. Agregado "stock" a las columnas ordenables
type SortColumn =
    | keyof Product
    | "brand.name"
    | "subCategory.category.name"
    | "stock";

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
                className={`w-3 h-3 transition-all duration-150 ${isActive
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
            } else if (sortColumn === "unit") {
                aValue = a.unit || "";
                bValue = b.unit || "";
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

    const thClasses = "px-2 py-3 md:px-4 select-none";
    const tdBase = "px-2 py-3 md:px-4";
    const hiddenOnMobile = "hidden md:table-cell!";

    const colWidths = {
        id: "w-[15%] md:w-[5%] xl:w-[5%]",
        name: "w-[35%] md:w-[20%] xl:w-[25%]",
        unit: "w-[15%] md:w-[12%] xl:w-[10%]",
        brand: "w-[15%] md:w-[12%] xl:w-[15%]",
        category: "w-[15%] md:w-[13%] xl:w-[15%]",
        stock: "w-[10%] md:w-[8%] xl:w-[10%]",
        price: "w-[15%] md:w-[15%] xl:w-[10%]",
        actions: "w-[25%] md:w-[15%] xl:w-[10%]",
        catalog: "w-[25%] md:w-[12%] xl:w-[10%]",
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table hoverable className="table-fixed w-full min-w-[1000px]">
                <TableHead>
                    <TableRow>
                        <TableHeadCell
                            className={`${thClasses} ${colWidths.id} cursor-pointer`}
                            onClick={() => handleSort("id")}
                        >
                            <div className="flex items-center">
                                # {renderSortArrow("id")}
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.name} cursor-pointer`}
                            onClick={() => handleSort("name")}
                        >
                            <div className="relative flex items-center justify-start xl:pl-10!">
                                <span>Nombre</span>
                                <div className="absolute translate-x-16">
                                    {renderSortArrow("name")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.unit} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() => handleSort("unit")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Unidad por bulto</span>
                                <div className="absolute translate-x-10">
                                    {renderSortArrow("unit")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.brand} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() => handleSort("brand.name")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Marca</span>
                                <div className="absolute translate-x-10">
                                    {renderSortArrow("brand.name")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.category} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() =>
                                handleSort("subCategory.category.name")
                            }
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Categoría</span>
                                <div className="absolute translate-x-16">
                                    {renderSortArrow(
                                        "subCategory.category.name",
                                    )}
                                </div>
                            </div>
                        </TableHeadCell>

                        {/* 🔥 3. Nueva columna Head de Stock (Oculta en mobile) */}
                        <TableHeadCell
                            className={`${thClasses} ${colWidths.stock} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() => handleSort("stock")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Stock</span>
                                <div className="absolute translate-x-10">
                                    {renderSortArrow("stock")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.price} ${hiddenOnMobile} cursor-pointer`}
                            onClick={() => handleSort("price")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Precio</span>
                                <div className="absolute translate-x-10">
                                    {renderSortArrow("price")}
                                </div>
                            </div>
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.actions} text-center`}
                        >
                            Acciones
                        </TableHeadCell>

                        <TableHeadCell
                            className={`${thClasses} ${colWidths.catalog} cursor-pointer`}
                            onClick={() => handleSort("showingInCatalog")}
                        >
                            <div className="relative flex items-center justify-center">
                                <span>Catálogo</span>
                                <div className="absolute translate-x-12">
                                    {renderSortArrow("showingInCatalog")}
                                </div>
                            </div>
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
                                {index + 1}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.name} text-gray-900 dark:text-white`}
                            >
                                <div className="xl:pl-10!">{product.name}</div>
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.unit} ${hiddenOnMobile}`}
                            >
                                <div className="text-center text-gray-600 dark:text-gray-400">
                                    {product.unit || "-"}
                                </div>
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.brand} ${hiddenOnMobile}`}
                            >
                                <div className="text-center italic">
                                    {product.brand?.name || "Sin marca"}
                                </div>
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.category} ${hiddenOnMobile}`}
                            >
                                <div className="text-center">
                                    {product.subCategory?.category?.name ||
                                        "Sin categoría"}
                                </div>
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.stock} ${hiddenOnMobile} font-medium text-center`}
                            >
                                <span
                                    className={`text-gray-900 dark:text-gray-300`}
                                >
                                    {product.stock ?? 0}
                                </span>
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.price} ${hiddenOnMobile} font-mono text-gray-900 dark:text-white text-center`}
                            >
                                {formatARS.format(product.price ?? 0)}
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.actions}`}
                            >
                                <div className="flex justify-center items-center gap-2 lg:gap-3!">
                                    <Link
                                        to={ROUTES.products.edit(product.id)}
                                        className="text-blue-500 hover:text-blue-400 transition cursor-pointer"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(product)}
                                        className="text-red-500 hover:text-red-400 transition cursor-pointer"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </TableCell>

                            <TableCell
                                className={`${tdBase} ${colWidths.catalog}`}
                            >
                                <div className="flex justify-center items-center">
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
