const BASE_URL = "http://localhost:3000/api";

export const brandApi = {
    getAll: async () => {
        const response = await fetch(`${BASE_URL}/brands`);
        if (!response.ok) throw new Error("Error al traer marcas");
        return response.json();
    },

    create: async (data: { name: string; subCategoryId: number }) => {
        const response = await fetch(`${BASE_URL}/brands`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Error al crear marca");
        return response.json();
    },

    disable: async (id: number) => {
        const response = await fetch(`${BASE_URL}/brands/${id}/disable`, {
            method: "PATCH",
        });

        if (!response.ok) throw new Error("Error al deshabilitar marca");
        return response.json();
    },
};
