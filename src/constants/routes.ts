export const ROUTES = {
    products: {
        list: "/management/products",
        create: "/management/products/create",
        edit: (id: number) => `/management/products/edit/${id}`,
    },
    brands: {
        list: "/management/brands",
        create: "/management/brands/create",
        edit: (id: number) => `/management/brands/edit/${id}`,
    },
};
