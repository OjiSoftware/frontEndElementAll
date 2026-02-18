import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProductsTable } from "../components/ProductsTable";
import { Product } from "@/types/product.types";
import Pagination from "../components/Pagination";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import SearchBar from "../components/SearchBar";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { useDisableProduct } from "@/hooks/useDisableProduct";
import { productApi } from "@/services/ProductService";

export default function ManagementPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );

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
        <DashboardLayout>
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
                            setProductToDelete(null);
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
