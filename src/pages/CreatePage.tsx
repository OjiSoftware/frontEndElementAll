import { useProductForm } from "@/hooks/useProductForm";
import DashboardLayout from "@/layouts/DashboardLayout"
import { useState } from "react";





export default function CreateProductPage() {

    const {
        formData,
        categories,
        brands,
        filteredSubCategories,
        handleChange,
        handleSubmit
    } = useProductForm();

    return (
        <DashboardLayout>
            <div className="bg-slate-800/80 border border-white/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                < div className="flex flex-col bg-blue-800" >
                    <form onSubmit={handleSubmit} className="space-y-6" >
                        {/* Nombre Producto */}
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Nombre producto
                        </label>
                        <input type="text" name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ingresar nombre de producto"
                            className=" w-full bg-slate-700 /90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                            required
                        />

                        {/* Categoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Categoria
                            </label>

                            <select name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                                required>

                                <option value={0}
                                >
                                    Seleccione una categoria
                                </option>

                                {categories.map((cat) => (

                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}

                            </select>
                        </div>


                        {/* Subcategoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Subcategoria
                            </label>

                            <select name="subCategoryId"
                                value={formData.subCategoryId}
                                onChange={handleChange}
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                                required>

                                <option value={0}
                                >
                                    Seleccione una subcategoria
                                </option>
                                {filteredSubCategories.map((subs) =>
                                    <option key={subs.id} value={subs.id}>{subs.name}</option>
                                )}

                            </select>
                        </div>

                        {/* Marca */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Marca
                            </label>

                            <select name="brandId"
                                value={formData.brandId}
                                onChange={handleChange} className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                                required>

                                <option value={0}>
                                    Seleccione una Marca
                                </option>

                                {brands.map((brs) => (
                                    <option key={brs.id} value={brs.id}>{brs.name}</option>
                                ))}

                            </select>
                        </div>

                        {/* Stock */}

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Stock
                            </label>
                            <input type="number" name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Ingresar cantidad stock"
                                className=" w-full bg-slate-700 /90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                required
                            />
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Precio producto
                            </label>
                            <input type="number" name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className=" w-full bg-slate-700 /90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer"
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detalles del producto..."
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all resize-none h-24"
                            />
                        </div>

                        {/* Imagen (URL) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                URL de la Imagen
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            />
                            {/* Imagen que se carga se muestra en miniatura */}
                            {formData.imageUrl && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-gray-500 h-40 w-full">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Vista previa"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Unidad */}

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Unidad
                            </label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                placeholder="Ej: kg, unidad, litro..."
                                className="w-full bg-slate-700/90 border border-gray-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                                required
                            />
                        </div>


                        <button
                            type="submit"
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            Crear Producto
                        </button>



                    </form>
                </div>
            </div >
        </DashboardLayout >
    );


}