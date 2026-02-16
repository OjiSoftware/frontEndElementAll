
const BASE_URL = 'http://localhost:3000/api';

export const productApi = {
    getById: async (id: string) => {
        const response = await fetch(`${BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Error al obtener producto');
        return response.json();
    },

    update: async (id: string, data: any) => {
        const response = await fetch(`${BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    getAllCategories: async () => {
        const response = await fetch(`${BASE_URL}/categories`);
        if (!response.ok) throw new Error('Error al traer categorías');
        return response.json();
    },

    getAllBrands: async () => {
        const response = await fetch(`${BASE_URL}/brands`);
        if (!response.ok) throw new Error('Error al traer marcas');
        return response.json();
    },

    getAllSubcategories: async () => {
        const response = await fetch(`${BASE_URL}/subcategories`);
        if (!response.ok) throw new Error('Errot al traer llas subcategorias');
        return response.json();
    }
};