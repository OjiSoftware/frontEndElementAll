import { SubCategory } from "./subcategory.types";

export interface Brand {
    id: number;
    name: string;
    subCategoryId: number;
    subCategory?: SubCategory;
    status?: boolean;
    createdAt?: string;
}

export interface CreateBrandDto {
    name: string;
    subCategoryId: number;
}
