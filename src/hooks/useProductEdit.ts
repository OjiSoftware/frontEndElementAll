// src/hooks/useProductEdit.ts
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "@/services/ProductService";
import toast from "react-hot-toast";
import { ProductEdit } from "@/types/product.types";
import { Category } from "@/types/category.types";
import { SubCategory } from "@/types/subcategory.types";
import { Brand } from "@/types/brand.types";

export function useProductEdit() {
    const { id } = useParams();

    const [formData, setFormData] = useState<ProductEdit>({
        name: "",
        brandId: 0,
        categoryId: 0,
        subCategoryId: 0,
        price: 0,
        description: "",
        showingInCatalog: false,
        imageUrl:
            "https://th.bing.com/th/id/R.ffe256686838d8692c8aee6a2dd4f10b?rik=PBFvuMeHlhrbZg&pid=ImgRaw&r=0",
    });

    const [priceInput, setPriceInput] = useState<string>("0,00");
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [isLoading, setLoading] = useState(false);

    // Función para formatear números a ARS
    const formatARS = (value: number) =>
        value.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const [
                    productData,
                    categoriesData,
                    brandsData,
                    subcategoriesData,
                ] = await Promise.all([
                    productApi.getById(id),
                    productApi.getAllCategories(),
                    productApi.getAllBrands(),
                    productApi.getAllSubcategories(),
                ]);

                setCategories(categoriesData);
                setBrands(brandsData);
                setSubCategories(subcategoriesData);

                const subCat: SubCategory | undefined = subcategoriesData.find(
                    (sub: SubCategory) => sub.id === productData.subCategoryId,
                );

                const newFormData = {
                    ...productData,
                    categoryId: subCat?.categoryId || 0,
                    subCategoryId: productData.subCategoryId || 0,
                    brandId: productData.brandId || 0,
                    showingInCatalog: productData.showingInCatalog ?? false,
                };

                setFormData(newFormData);

                // Formatear precio a string para el input
                setPriceInput(formatARS(Number(productData.price)));
            } catch (error) {
                console.error("Error al cargar datos:", error);
                toast.error("Error al cargar los datos del producto.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    return {
        id,
        formData,
        setFormData,
        priceInput,
        setPriceInput,
        categories,
        brands,
        subCategories,
        isLoading,
        formatARS,
    };
}
