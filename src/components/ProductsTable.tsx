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
import { Product } from "@/types/product.types";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CheckCircle } from "lucide-react";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";

// Extendemos Product internamente para que TS sepa que trae el originalIndex
type ProductWithIndex = Product & { originalIndex?: number };

interface ProductsTableProps {
    products: ProductWithIndex[];
    onDelete: (product: Product) => void;
    currentPage: number;
    itemsPerPage: number;
    // Props para ordenamiento controlado desde el padre
    onSort: (column: string) => void;
    currentSortColumn: string | null;
    currentSortDirection: "asc" | "desc" | null;
}

export function ProductsTable({
    products,
    onDelete,
    currentPage,
    itemsPerPage,
    onSort,
    currentSortColumn,
    currentSortDirection,
}: ProductsTableProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
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

    const handleOpenDetails = (product: Product) => {
        setSelectedProduct(product);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsModalOpen(false);
        setSelectedProduct(null);
    };

    const renderSortArrow = (column: string) => {
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

    const hideOnTablet = "hidden lg:table-cell!";
    const hideOnMobile = "hidden md:table-cell!";

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <Table hoverable className="w-full">
          <TableHead>
            <TableRow>
              <TableHeadCell
                className="px-4 w-14 cursor-pointer select-none"
                onClick={() => onSort('rowNum')}
              >
                <div className="flex items-center">
                  # {renderSortArrow('rowNum')}
                </div>
              </TableHeadCell>

              <TableHeadCell
                className="cursor-pointer select-none text-center"
                onClick={() => onSort('name')}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span>Nombre</span>
                  <div className="absolute -right-6">
                    {renderSortArrow('name')}
                  </div>
                </div>
              </TableHeadCell>

              <TableHeadCell
                className={`${hideOnTablet} cursor-pointer select-none text-center`}
                onClick={() => onSort('unit')}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span>Unidad</span>
                  <div className="absolute -right-6">
                    {renderSortArrow('unit')}
                  </div>
                </div>
              </TableHeadCell>

              <TableHeadCell
                className={`${hideOnTablet} cursor-pointer select-none text-center`}
                onClick={() => onSort('brand.name')}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span>Marca</span>
                  <div className="absolute -right-6">
                    {renderSortArrow('brand.name')}
                  </div>
                </div>
              </TableHeadCell>

              <TableHeadCell
                className={`${hideOnTablet} cursor-pointer select-none text-center`}
                onClick={() => onSort('subCategory.category.name')}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span>Categoría</span>
                  <div className="absolute -right-6">
                    {renderSortArrow('subCategory.category.name')}
                  </div>
                </div>
              </TableHeadCell>

              <TableHeadCell
                className={`${hideOnMobile} cursor-pointer select-none text-center`}
                onClick={() => onSort('stock')}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span>Stock</span>
                  <div className="absolute -right-6">
                    {renderSortArrow('stock')}
                  </div>
                </div>
              </TableHeadCell>

              <TableHeadCell
                className={`${hideOnMobile} cursor-pointer select-none text-center`}
                onClick={() => onSort('price')}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span>Precio</span>
                  <div className="absolute -right-6">
                    {renderSortArrow('price')}
                  </div>
                </div>
              </TableHeadCell>

              <TableHeadCell className="select-none text-center">
                Acciones
              </TableHeadCell>

              <TableHeadCell
                className="cursor-pointer select-none text-center"
                onClick={() => onSort('showingInCatalog')}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span className="md:hidden">Cat.</span>
                  <span className="hidden md:inline">Catálogo</span>
                  <div className="absolute -right-6">
                    {renderSortArrow('showingInCatalog')}
                  </div>
                </div>
              </TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y">
            {products.map((product) => (
              <TableRow
                key={product.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-sm md:text-base"
              >
                <TableCell className="px-4 md:font-bold text-gray-900 dark:text-white">
                  {product.originalIndex}
                </TableCell>

                <TableCell className="text-left">
                  <div className="flex flex-col items-start justify-center">
                    <span className="md:font-bold text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">
                      ID: {product.id}
                    </span>
                  </div>
                </TableCell>

                <TableCell
                  className={`${hideOnTablet} text-center text-gray-600 dark:text-gray-400`}
                >
                  {product.unit || '-'}
                </TableCell>

                <TableCell
                  className={`${hideOnTablet} text-center text-gray-600 dark:text-gray-400`}
                >
                  {product.brand?.name || 'Sin marca'}
                </TableCell>

                <TableCell
                  className={`${hideOnTablet} text-center text-gray-600 dark:text-gray-400`}
                >
                  {product.subCategory?.category?.name || 'Sin categoría'}
                </TableCell>

                <TableCell className={`${hideOnMobile} font-bold text-center`}>
                  <span
                    className={
                      product.stock === 0
                        ? 'text-red-600 dark:text-red-500'
                        : 'text-gray-900 dark:text-gray-300'
                    }
                  >
                    {product.stock ?? 0}
                  </span>
                </TableCell>

                <TableCell
                  className={`${hideOnMobile} font-mono text-gray-900 dark:text-white text-center`}
                >
                  {formatARS.format(product.price ?? 0)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      title="Ver detalles"
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition active:scale-95 cursor-pointer"
                      onClick={() => handleOpenDetails(product)}
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <Link
                      title="Editar producto"
                      to={ROUTES.products.edit(product.id)}
                      className="text-indigo-400 hover:text-indigo-300 transition active:scale-95"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button
                      title="Eliminar producto"
                      onClick={() => onDelete(product)}
                      className="text-red-500 hover:text-red-400 transition active:scale-95 cursor-pointer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </TableCell>

                <TableCell>
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

        {isDetailsModalOpen && selectedProduct && (
          <ProductDetailsModal
            isOpen={isDetailsModalOpen}
            product={selectedProduct}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    );
}
