import { Brand } from "./brand.types";
import { SubCategory } from "./subcategory.types";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    subCategoryId: number;
    subCategory?: SubCategory & { category: { id: number; name: string } };
    brandId?: number;
    brand?: Brand;
    stock?: number;
    unit?: string;
    status?: boolean;
    createdAt?: string;
}

// Para el formulario de edición
export interface ProductEdit {
    name: string;
    brandId: number;
    categoryId: number;
    subCategoryId: number;
    price: number;
    description: string;
    imageUrl: string;
}
