export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: {
        id: number;
        name: string;
    };
    brand?: {
        id: number;
        name: string;
    };
}

/* export interface Product {
    id: number;
    name: string;
    color: string;
    category: string;
    price: string;
} */

