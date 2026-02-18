import { useState, useEffect } from "react";
import { Brand } from "@/types/brand.types";
import { SubCategory } from "@/types/subcategory.types";
import { Category } from "@/types/category.types";
import { productApi } from "@/services/ProductService";


export const useProductForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        categoryId: 0,
        subCategoryId: 0,
        brandId: 0,
        stock: 0,
        description: "",
        imageUrl: "",
        unit: "",
    })

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

    useEffect(() => {
        const loadData = async () => {

            try {
                const [cat, subCat, brands] = await Promise.all([
                    productApi.getAllCategories(),
                    productApi.getAllSubcategories(),
                    productApi.getAllBrands(),
                ])

                setCategories(cat);
                setAllSubCategories(subCat)
                setBrands(brands)
            } catch (error) {
                console.error("Error cargando los datos de campos: ", error)
            }

        };
        loadData();
    }, [])


    useEffect(() => {
        const subs = allSubCategories.filter(sub => sub.categoryId === formData.categoryId)
        /* sub: Es el nombre que le das a "cada subcategoría" mientras el filtro las recorre.
        sub.categoryId: Es el ID que trae la subcategoría desde la base de datos.
        === formData.categoryId: Es la comparación con lo que el usuario seleccionó en el formulario. 
        */

        setFilteredSubCategories(subs)

        if (formData.subCategoryId != 0)
            setFormData(prev => ({ ...prev, subCategoryId: 0 }));


    }, [formData.categoryId, allSubCategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        const finalValue = (name.includes('Id') || name === 'price' || name === 'stock') ? Number(value) : value

        setFormData({
            ...formData,
            [name]: finalValue
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const { categoryId, ...productData } = formData;


            if (productData.subCategoryId === 0 || productData.brandId === 0) {
                alert("Por favor, seleccione una subcategoría y una marca válida.");
                return;
            }

            const res = await productApi.create(productData);

            console.log("Producto creado:", res);
            alert("¡Producto creado con éxito!");

            // Resetear el formulario a su estado inicial
            setFormData({
                name: "",
                description: "",
                price: 0,
                categoryId: 0,
                subCategoryId: 0,
                brandId: 0,
                stock: 0,
                imageUrl: "",
                unit: ""
            });

        } catch (error) {
            console.error("Error al crear el producto:", error);
            alert("Hubo un error al crear el producto. Revisa la consola.");
        }
    };



    return {
        formData,
        categories,
        brands,
        filteredSubCategories,
        handleChange,
        handleSubmit
    };

}