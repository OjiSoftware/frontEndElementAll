import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductsPage from "@/pages/products/ProductsPage";
import CreateProductPage from "@/pages/products/CreateProductPage";
import EditProductPage from "@/pages/products/EditProductPage";

// import BrandsPage from "@/pages/brands/BrandsPage";
import CreateBrandPage from "@/pages/brands/CreateBrandPage";
// import EditBrandPage from "@/pages/brands/EditBrandPage";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* HOME */}
                <Route path="/" element={<ProductsPage />} />

                {/* PRODUCTS */}
                <Route path="/management/products" element={<ProductsPage />} />
                <Route
                    path="/management/products/create"
                    element={<CreateProductPage />}
                />
                <Route
                    path="/management/products/edit/:id"
                    element={<EditProductPage />}
                />

                {/* BRANDS */}
                {/* <Route path="/management/brands" element={<BrandsPage />} /> */
                <Route
                    path="/management/brands/create"
                    element={<CreateBrandPage />}
                />
                /* <Route
                    path="/management/brands/edit/:id"
                    element={<EditBrandPage />}
                /> */}
            </Routes>
        </BrowserRouter>
    );
};
