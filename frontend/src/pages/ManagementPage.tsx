import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProductsTable, Product } from "../components/ProductsTable";
import Pagination from "../components/Pagination";
import { useItemsPerpage } from "@/hooks/useItemsPerpage";

/* Simulación de datos */
const DATA_PRUEBA: Product[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Producto Apple ${i + 1}`,
    color: i % 2 === 0 ? "Red" : "Silver",
    category: "Gadgets",
    price: `$${(i + 1) * 100}`,
}));

export default function ManagementPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = useItemsPerpage();

    /* Aca se hacen los calculos de paginacion */
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentProducts = DATA_PRUEBA.slice(firstIndex, lastIndex);


    /* se va a ejecutar por cada cambio de itemsPerPage asi se actualiza cada vez que haya un cambio de tamaño, y no quedan los numeros de la paginacion por cualquier lado */
    useEffect(() => {
        setCurrentPage(1)
    }, [itemsPerPage]);

    return (
        <DashboardLayout>
            <div className="space-y-4">
                {/* Le pasamos 5 productos nomas */}
                <ProductsTable products={currentProducts} />

                {/* Le pasamos los controles */}
                <Pagination
                    totalItems={DATA_PRUEBA.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </DashboardLayout>
    );
}