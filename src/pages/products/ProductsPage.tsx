import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProductsTable } from "@/components/ProductsTable";
import Pagination from "@/components/Pagination";
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
                    className="px-4 py-3 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all duration-300 cursor-pointer"
                >
                    + Nuevo producto
                </button>
            }
        >
            <div className="space-y-4">
                {/* SEARCH BAR */}
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Buscar productos"
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
