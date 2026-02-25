import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProductsTable } from "@/components/ProductsTable";
import Pagination from "@/components/PaginationManagement";
import { Product } from "@/types/product.types";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import SearchBar from "../../components/SearchBar";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useDisableProduct } from "@/hooks/useDisableProduct";
import { productApi } from "@/services/ProductService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";


export default function ProductsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );
    const navigate = useNavigate();
    const itemsPerPage = useItemsPerpage();
    const { disableProduct, loading } = useDisableProduct(setProducts);

    // ---------------- Filtrado ----------------
    const filteredProducts = products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .filter((p) => p.status);

    // ---------------- Paginación ----------------
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

    // ---------------- Fetch ----------------
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productApi.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error cargando productos", error);
            }
        };
        fetchProducts();
    }, []);

    // Resetear página al cambiar itemsPerPage o query
    useEffect(() => setCurrentPage(1), [itemsPerPage, query]);

    return (
        <DashboardLayout
            title="Lista de productos"
            subtitle="Gestión de productos del sistema."
            actions={
                <button
                    onClick={() => navigate(ROUTES.products.create)}
                    className="px-3 py-3 text-sm rounded-lg bg-indigo-600 text-white font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    title="Crear nuevo producto"
                >
                    <span className="md:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                        >
                            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                            <path d="M9 15h6" />
                            <path d="M12 18v-6" />
                        </svg>
                    </span>
                    <span className="hidden md:inline">
                        + Nuevo producto
                    </span>{" "}
                </button>
            }
        >
            <div className="space-y-4">
                {/* SEARCH BAR */}
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Buscar marcas"
                    containerClassName="max-w-full"
                    inputClassName="
                      bg-gray-900
                      text-white
                      border-gray-700
                      placeholder-gray-500
                      focus:ring-indigo-500
                    "
                    iconClassName="text-gray-400"
                />

                {/* PRODUCTS TABLE */}
                <ProductsTable
                    products={currentProducts}
                    onDelete={(product) => setProductToDelete(product)}
                />

                {/* PAGINATION */}
                <Pagination
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />

                {/* MODAL DE CONFIRMACIÓN */}
                {productToDelete && (
                    <ConfirmDeleteModal
                        isOpen={true}
                        itemName={productToDelete.name}
                        isLoading={loading}
                        onCancel={() => setProductToDelete(null)}
                        onConfirm={async () => {
                            await disableProduct(productToDelete.id);

                            if (
                                currentProducts.length === 1 &&
                                currentPage > 1
                            ) {
                                setCurrentPage((prev) => prev - 1);
                            }

                            setProductToDelete(null);
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
