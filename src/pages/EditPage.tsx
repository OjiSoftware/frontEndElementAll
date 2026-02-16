import React, { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import { useNavigate, useParams } from "react-router-dom";
import { H1Icon } from "@heroicons/react/24/outline";
import { productApi } from "@/services/ProductService";

interface ProductEdit {
    name: string;
    brandId: number;
    categoryId: number;
    subcategoryId: number;
    price: number;
    description: string;
}


interface Category {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

export default function EditProductPage() {
    /* Estado base del formulario */
    const [formData, setFormData] = useState<ProductEdit>({
        name: "",
        brandId: 0,
        categoryId: 0,
        subcategoryId: 0,
        price: 0,
        description: "",
    });

    const { id } = useParams(); /* -> esto basicamente obtiene el id, que le viene por la url */

    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])


    console.log('Anduvo el id = ', id)

    const [isLoading, setLoading] = useState(false)

    const navigate = useNavigate()

    /* Aca ponemos el fetch api despues con el id */



    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            try {

                const [productData, categoriesData, brandsData, subcategoriesData] = await Promise.all([
                    productApi.getById(id),
                    productApi.getAllCategories(),
                    productApi.getAllBrands(),
                    productApi.getAllSubcategories()
                ]);

                const data = await productApi.getById(id);
                console.log("DATOS QUE LLEGAN DEL BACKEND:", data); // <--- ESTO ES CLAVE

                setFormData({
                    ...productData,
                    categoryId: productData.category?.id || 0,
                    brandId: productData.brand?.id || 0,
                    subcategoryId: productData.subcategory?.id || 0
                });

                setCategories(categoriesData);
                setSubCategories(subcategoriesData)
                setBrands(brandsData);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();


    }, [id]);

    if (!id) return <div><h1>Producto no encontrado</h1> <button onClick={() => navigate('/management')}>Volver</button></div>

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            /* Convertir a número si el campo es el precio */
            [name]: name === "price" || name === "brandId" || name === "categoryId" || name === "subcategoryId" ? parseFloat(value) || 0 : value,

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


                        {/* BRAND SELECT */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Marca</label>
                            <select
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                                required
                            >
                                <option value="">Seleccione una marca</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
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

                        {/* CATEGORY SELECT */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
                            <select
                                name="categoryId" // Usamos el ID para el backend
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                            >
                                <option value="">Seleccione una categoría</option>
                                {/* Aquí mapearás las categorías que traigas del backend */}
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SUBCATEGORY */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
                            <select
                                name="subcategoryId"
                                value={formData.subcategoryId}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                            >
                                <option value="">Seleccione una sub categoria</option>

                                {subCategories.map((subCat) => (
                                    <option key={subCat.id} value={subCat.id}>
                                        {subCat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* BOTONES */}
                        <div className="md:col-span-2 flex items-center justify-end gap-4 mt-6 pt-6 border-t border-white/5">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                                onClick={() => navigate('/management')}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

