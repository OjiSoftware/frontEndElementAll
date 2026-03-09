import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, X, PlusIcon } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProductsTable } from "@/components/ProductsTable";
import Pagination from "@/components/PaginationManagement";
import { Product } from "@/types/product.types";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import SearchBar from "../../../components/SearchBar";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useDisableProduct } from "@/hooks/useDisableProduct";
import { productApi } from "@/services/ProductService";
import { ROUTES } from "@/constants/routes";

export default function ProductsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // ---------------- Estados ----------------
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // ---------------- Estados del Toast ----------------
    const [showWelcome, setShowWelcome] = useState(false);
    const [userName, setUserName] = useState("");

    const itemsPerPage = useItemsPerpage();
    const { disableProduct, loading } = useDisableProduct(setProducts);

    // ---------------- Filtrado con .trim() ----------------
    const filteredProducts = products.filter((p) => {
        const searchTerm = query.trim().toLowerCase();
        const matchesQuery = p.name.toLowerCase().includes(searchTerm);
        const isActive = p.status;
        return matchesQuery && isActive;
    });

    // ---------------- Paginación ----------------
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

    // ---------------- Toast de Bienvenida ----------------
    useEffect(() => {
        if (location.state?.welcome) {
            setUserName(location.state.userName || "Usuario");
            setShowWelcome(true);
            window.history.replaceState({}, document.title);
            const timer = setTimeout(() => setShowWelcome(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [location]);

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

    useEffect(() => setCurrentPage(1), [itemsPerPage, query]);

    return (
        <>
            {/* TOAST DE BIENVENIDA - Estilo ElementAll */}
            <div
                className={`fixed top-6 right-6 z-[100] transition-all duration-500 transform ${
                    showWelcome
                        ? "translate-x-0 opacity-100"
                        : "translate-x-[120%] opacity-0"
                }`}
            >
                <div className="bg-slate-800/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-4 flex items-start gap-3 min-w-[300px]">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white">
                            ¡Hola, {userName}!
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Sesión iniciada correctamente.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowWelcome(false)}
                        className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <DashboardLayout
                title="Lista de productos"
                subtitle="Gestión de productos del sistema."
                actions={
                    <button
                        onClick={() => navigate(ROUTES.products.create)}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
                    >
                        <PlusIcon size={18} />
                        <span className="hidden md:inline">Nuevo producto</span>
                    </button>
                }
            >
                <div className="space-y-6">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        placeholder="Buscar..." // Cambiá el texto según la página
                        containerClassName="max-w-full"
                        inputClassName="
                        bg-transparent
                        text-white
                        border-white/10
                        placeholder:text-slate-500
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500
                        transition-all
                        rounded-xl
                        h-11
                      "
                        iconClassName="text-slate-500 group-focus-within:text-indigo-400"
                    />

                    {/* PRODUCTS TABLE - Rounded-xl para coherencia visual */}
                    <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-slate-900/20">
                        <ProductsTable
                            products={currentProducts}
                            onDelete={(product) => setProductToDelete(product)}
                        />
                    </div>

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
        </>
    );
}
