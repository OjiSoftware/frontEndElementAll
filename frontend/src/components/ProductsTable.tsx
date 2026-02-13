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

type SortColumn = keyof Product;

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
        if (sortColumn !== column) return null;
        return (
            <ArrowUpIcon
                className={`w-3 h-3 ms-1 inline-block text-gray-400 transition-transform ${
                    sortDirection === "desc" ? "rotate-180" : ""
                }`}
            />
        );
    };

    // ---------------- Sorted Products ----------------
    const sortedProducts = useMemo(() => {
        if (!sortColumn) return products;

        return [...products].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (sortColumn === "id") {
                return sortDirection === "asc"
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
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
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 select-none">
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell
                                className="px-4 w-14 cursor-pointer text-left! md:text-center!"
                                onClick={() => handleSort("id")}
                            >
                                # {renderSortArrow("id")}
                            </TableHeadCell>

                            <TableHeadCell
                                className="cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                <div className={headerClass}>
                                    Product name {renderSortArrow("name")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell
                                className="hidden md:table-cell! cursor-pointer"
                                onClick={() => handleSort("color")}
                            >
                                <div className={headerClass}>
                                    Color {renderSortArrow("color")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell
                                className="hidden md:table-cell! cursor-pointer"
                                onClick={() => handleSort("category")}
                            >
                                <div className={headerClass}>
                                    Category {renderSortArrow("category")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell
                                className="hidden md:table-cell! cursor-pointer text-center"
                                onClick={() => handleSort("price")}
                            >
                                <div className={headerClass}>
                                    Price {renderSortArrow("price")}
                                </div>
                            </TableHeadCell>

                            <TableHeadCell>Acciones</TableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody className="divide-y">
                        {sortedProducts.map((product) => (
                            <TableRow
                                key={product.id}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <TableCell className="px-4 text-left! md:text-center! text-gray-500">
                                    {product.id}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-left">
                                    {product.name}
                                </TableCell>
                                <TableCell className="hidden md:table-cell! text-left">
                                    {product.color}
                                </TableCell>
                                <TableCell className="hidden md:table-cell! text-left">
                                    {product.category}
                                </TableCell>
                                <TableCell className="hidden md:table-cell! text-center">
                                    {product.price}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <button
                                            title="Editar producto"
                                            className="text-blue-500 hover:text-blue-400 transition cursor-pointer"
                                        >
                                            <PencilIcon className="size-5" />
                                        </button>
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
