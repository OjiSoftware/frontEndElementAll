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

// Dentro de tu archivo de la tabla
type SortColumn = keyof Product | "brand.name" | "subCategory.category.name";

interface ProductsTableProps {
    products: Product[];
    onDelete?: (product: Product) => void;
}

export function ProductsTable({ products, onDelete }: ProductsTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
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

    // ---------------- Sorted Products ----------------
    const sortedProducts = useMemo(() => {
        if (!sortColumn) return products;

        return [...products].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (
                sortColumn === "brand.name" ||
                (sortColumn as string) === "brand"
            ) {
                aValue = a.brand?.name || "";
                bValue = b.brand?.name || "";
            } else if (
                sortColumn === "subCategory.category.name" ||
                (sortColumn as string) === "subCategory.category"
            ) {
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

    const headerClass = "cursor-pointer select-none flex items-center gap-1";

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell
                                className="px-4 w-14 text-center cursor-pointer select-none"
                                onClick={() => handleSort("id")}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <span>#</span>
                                    {renderSortArrow("id")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell
                                className="cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                <div className={headerClass}>
                                    Nombre {renderSortArrow("name")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell
                                className="hidden md:table-cell! cursor-pointer"
                                onClick={() => handleSort("brand")}
                            >
                                <div className={headerClass}>
                                    Marca {renderSortArrow("brand")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell
                                className="hidden md:table-cell! cursor-pointer"
                                onClick={() =>
                                    handleSort("subCategory.category.name")
                                }
                            >
                                <div className={headerClass}>
                                    Categoria{" "}
                                    {renderSortArrow(
                                        "subCategory.category.name",
                                    )}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell
                                className="hidden md:table-cell!  cursor-pointer"
                                onClick={() => handleSort("price")}
                            >
                                <div className={headerClass}>
                                    Precio {renderSortArrow("price")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell className="select-none">
                                Acciones
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody className="divide-y">
                        {sortedProducts.map((product) => (
                            <TableRow
                                key={product.id}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <TableCell className="px-4 text-left! text-gray-500">
                                    {product.id}
                                </TableCell>

                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-left">
                                    {product.name}
                                </TableCell>

                                <TableCell className="hidden md:table-cell! text-left">
                                    {product.brand?.name || "sin marca"}
                                </TableCell>
                                <TableCell className="hidden md:table-cell! text-left">
                                    {product.subCategory?.category?.name ||
                                        "sin categoria"}
                                </TableCell>

                                <TableCell className="hidden md:table-cell! text-left">
                                    {`$${product.price}`}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            to={`/edit/${product.id}`}
                                            title="Editar producto"
                                            className="text-blue-500 hover:text-blue-400 transition cursor-pointer"
                                        >
                                            <PencilIcon className="size-5" />
                                        </Link>
                                        <button
                                            title="Eliminar producto"
                                            className="text-red-500 hover:text-red-400 transition cursor-pointer"
                                            onClick={() =>
                                                setProductToDelete(product)
                                            }
                                        >
                                            <TrashIcon className="size-5" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ---------------- Modal ---------------- */}
            {productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg text-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Confirmar eliminación
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            ¿Seguro que querés eliminar{" "}
                            <b>{productToDelete.name}</b>?
                        </p>
                        <div className="mt-4 flex justify-center gap-3">
                            {" "}
                            <button
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                onClick={() => setProductToDelete(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => {
                                    onDelete?.(productToDelete);
                                    setProductToDelete(null);
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
