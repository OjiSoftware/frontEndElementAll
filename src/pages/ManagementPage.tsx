import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProductsTable } from "../components/ProductsTable";
import { Product } from "@/types/product.types";
import Pagination from "../components/Pagination";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";
import SearchBar from "../components/SearchBar";

/* Datos de prueba */
const DATA_PRUEBA: Product[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Producto Apple ${i + 1}`,
    color: i % 2 === 0 ? "Rojo" : "Plateado",
    category: i % 3 === 0 ? "Gadgets" : "Accesorios",
    price: `$${(i + 1) * 100}`,
}));

export default function ManagementPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const itemsPerPage = useItemsPerpage();

    // Filtrado solo por búsqueda
    const filteredProducts = DATA_PRUEBA.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
    );

    // Paginación
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

    // Resetear página al cambiar itemsPerPage o query
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, query]);

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
                <ProductsTable products={currentProducts} />

                {/* PAGINATION */}
                <Pagination
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </DashboardLayout>
    );
}
