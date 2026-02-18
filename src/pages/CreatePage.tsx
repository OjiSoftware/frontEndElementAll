import { useProductForm } from "@/hooks/useProductForm";
import DashboardLayout from "@/layouts/DashboardLayout";
import { PackagePlus, Image as ImageIcon, Tag, Info, DollarSign } from "lucide-react";

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
            <div className="max-w-5xl mx-auto">
                {/* Encabezado */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <PackagePlus className="text-indigo-400" size={32} />
                        Nuevo Producto
                    </h1>
                    <p className="text-slate-400 mt-2">Complete la información para crear un nuevo producto.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Información y Clasificación (2/3 de ancho) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información General */}
                        <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                            <h2 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                                <Info size={20} /> Información General
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del Producto</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                                        placeholder="Ej: Teclado Mecánico RGB"
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange}
                                        placeholder="Describe las características principales..."
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-32"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clasificación */}
                        <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl shadow-xl">
                            <h2 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                                <Tag size={20} /> Clasificación
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Categoría</label>
                                    <select name="categoryId" value={formData.categoryId} onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                        <option value={0}>Seleccionar...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Subcategoría</label>
                                    <select name="subCategoryId" value={formData.subCategoryId} onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                        <option value={0}>Seleccionar...</option>
                                        {filteredSubCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Marca</label>
                                    <select name="brandId" value={formData.brandId} onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                        <option value={0}>Seleccionar...</option>
                                        {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Botones  */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex-1 bg-red-800 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl transition-all border border-white/10 active:scale-[0.98]"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                            >
                                Guardar Producto
                            </button>
                        </div>
                    </div>

                    {/* Columna Derecha: Imagen con el stock y precios (1/3 de ancho) */}
                    <div className="space-y-6">
                        {/*Precios y Stock */}
                        <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl shadow-xl">
                            <h2 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                                <DollarSign size={20} /> Valores
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Stock</label>
                                        <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Unidad</label>
                                        <input type="text" name="unit" value={formData.unit} onChange={handleChange}
                                            placeholder="kg, un..." className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Precio</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-slate-500">$</span>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Imagen */}
                        <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl shadow-xl">
                            <h2 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                                <ImageIcon size={20} /> Imagen
                            </h2>
                            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                                placeholder="Pegar URL de imagen..."
                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                            />
                            <div className="aspect-square w-full rounded-xl bg-slate-900/80 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon className="mx-auto text-slate-600 mb-2" size={40} />
                                        <p className="text-xs text-slate-500 text-balance">La vista previa aparecerá aquí al pegar un URL válido</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}