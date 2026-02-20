import { useState } from "react";
import { toast } from "react-hot-toast";
import { Sale } from "../types/sale.types";
import { saleApi } from "../services/SaleService";

export function useDisableSale(
    setSales: React.Dispatch<React.SetStateAction<Sale[]>>,
) {
    const [loading, setLoading] = useState(false);

    const disableSale = async (id: number) => {
        setLoading(true);

        try {
            // Llamada al API
            await saleApi.update(id.toString(), {
                status: "CANCELLED", 
            });

            // Actualiza la lista local
            setSales((prev) =>
                prev.map((s): Sale => (s.id === id ? { ...s, status: "CANCELLED" } : s))
            );

            toast.success("Venta deshabilitada");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo deshabilitar la venta");
        } finally {
            setLoading(false);
        }
    };

    return { disableSale, loading };
}
