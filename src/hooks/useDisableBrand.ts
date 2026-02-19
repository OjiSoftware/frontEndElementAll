import { useState } from "react";
import { toast } from "react-hot-toast";
import { Brand } from "@/types/brand.types";
import { brandApi } from "@/services/BrandService";

export function useDisableBrand(
    setBrands: React.Dispatch<React.SetStateAction<Brand[]>>,
) {
    const [loading, setLoading] = useState(false);

    const disableBrand = async (id: number) => {
        setLoading(true);

        try {
            // Solo actualizamos status a false
            await brandApi.update(id.toString(), { status: false });

            // Actualizamos la lista local sin eliminar elementos
            setBrands((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: false } : b)),
            );

            toast.success("Marca deshabilitada");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo deshabilitar la marca");
        } finally {
            setLoading(false);
        }
    };

    return { disableBrand, loading };
}
