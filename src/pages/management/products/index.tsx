import { useEffect, useState, useMemo } from "react";
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
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );

    // ---------------- Estados de Ordenamiento ----------------
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
        null,
    );

    // ---------------- Estados del Toast ----------------
    const [showWelcome, setShowWelcome] = useState(false);
    const [userName, setUserName] = useState("");

    const itemsPerPage = useItemsPerpage();
    const { disableProduct, loading } = useDisableProduct(setProducts);

    // ---------------- Lógica de Filtrado y Ordenamiento ----------------
    const filteredProducts = useMemo(() => {
        const searchTerm = query.trim().toLowerCase();

        // 1. Filtrar
        const filtered = products.filter((p) => {
            const matchesQuery = p.name.toLowerCase().includes(searchTerm);
            return p.status && matchesQuery;
        });

        // 2. Asignar posición original (para que el número de fila "viaje" con el objeto)
        const productsWithIndex = filtered.map((product, index) => ({
            ...product,
            originalIndex: index + 1,
        }));

        // Si no hay ordenamiento activo, devolvemos la lista con los índices
        if (!sortColumn || !sortDirection) {
            return productsWithIndex;
        }

        // 3. Ordenar
        return [...productsWithIndex].sort((a, b) => {
            let aVal: any;
            let bVal: any;

            if (sortColumn === "rowNum") {
                aVal = (a as any).originalIndex;
                bVal = (b as any).originalIndex;
            } else if (sortColumn === "brand.name") {
                aVal = a.brand?.name || "";
                bVal = b.brand?.name || "";
            } else if (sortColumn === "subCategory.category.name") {
                aVal = a.subCategory?.category?.name || "";
                bVal = b.subCategory?.category?.name || "";
            } else {
                aVal = a[sortColumn as keyof Product] ?? "";
                bVal = b[sortColumn as keyof Product] ?? "";
            }

            // Comparación Numérica
            if (
                sortColumn === "rowNum" ||
                sortColumn === "id" ||
                sortColumn === "stock" ||
                sortColumn === "price" ||
                typeof aVal === "number"
            ) {
                return sortDirection === "asc"
                    ? Number(aVal) - Number(bVal)
                    : Number(bVal) - Number(aVal);
            }

            // Comparación de Strings (o booleanos convertidos a string)
            return sortDirection === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [products, query, sortColumn, sortDirection]);

    // ---------------- Paginación ----------------
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

    // ---------------- Funciones ----------------
    const handleSort = (col: string) => {
        if (sortColumn === col) {
            if (sortDirection === "asc") {
                setSortDirection("desc");
            } else if (sortDirection === "desc") {
                setSortColumn(null);
                setSortDirection(null);
            }
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    // ---------------- Efectos ----------------
    useEffect(() => {
        if (location.state?.welcome) {
            setUserName(location.state.userName || "Usuario");
            setShowWelcome(true);
            window.history.replaceState({}, document.title);
            const timer = setTimeout(() => setShowWelcome(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [location]);

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
            {/* TOAST DE BIENVENIDA */}
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
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-500 text-white font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
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
                        placeholder="Buscar por nombre del producto..."
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

                    <ProductsTable
                        products={currentProducts}
                        onDelete={(product) => setProductToDelete(product)}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onSort={handleSort}
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                    />

                    <Pagination
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />

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
