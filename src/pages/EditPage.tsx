import React, { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"


interface ProductEdit {
    name: string;
    brand: string;
    subcategory: string;
    category: string;
    price: number;
}


export default function EditProductPage() {
    /* Estado base del formulario */
    const [formData, setFormData] = useState<ProductEdit>({
        name: "",
        brand: "",
        subcategory: "",
        category: "",
        price: 0,
    });

    const [isLoading, setLoading] = useState(false)

    /* Aca ponemos el fetch api despues con el id */

    useEffect(() => {

        setFormData({ name: 'Planticida', brand: 'gg', subcategory: 'ggg', category: 'gggg', price: 100 })
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            // Convertimos a número si el campo es el precio
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Aca se hace la conexion:
            // await axios.put(`/api/products/${id}`, formData);
            console.log("Enviando al Backend:", formData);
            alert("Enviando datos al servidor...");
        } catch (error) {
            console.error("Error al conectar con el backend", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Editar Producto</h1>
                    <p className="text-gray-400 mt-2">Los cambios se sincronizarán con la base de datos.</p>
                </div>

                <div className="bg-slate-900/50 border border-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* BRAND */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Marca (Brand)</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Ej: Samsung"
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                required
                            />
                        </div>

                        {/* PRICE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Precio ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                required
                            />
                        </div>

                        {/* CATEGORY */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* SUBCATEGORY */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Subcategoría</label>
                            <input
                                type="text"
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* BOTONES */}
                        <div className="md:col-span-2 flex items-center justify-end gap-4 mt-6 pt-6 border-t border-white/5">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Guardando..." : "Actualizar en BD"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

