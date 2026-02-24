import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductsPage from "@/pages/products/ProductsPage";
import CreateProductPage from "@/pages/products/CreateProductPage";
import EditProductPage from "@/pages/products/EditProductPage";

import BrandsPage from "@/pages/brands/BrandsPage";
import CreateBrandPage from "@/pages/brands/CreateBrandPage";
import EditBrandPage from "@/pages/brands/EditBrandPage";

import SalesPage from "@/pages/sales/SalesPage";
import CreateSalesPage from "@/pages/sales/CreateSalesPage";
import EditSAlesPage from "@/pages/sales/EditSalesPage";
import CatalogPage from "@/pages/catalog/catalogPage";

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
                <Route path="/management/brands" element={<BrandsPage />} />
                <Route
                    path="/management/brands/create"
                    element={<CreateBrandPage />}
                />
                <Route
                    path="/management/brands/edit/:id"
                    element={<EditBrandPage />}
                />

                {/* SALES */}
                <Route path="/management/sales" element={<SalesPage />} />
                <Route
                    path="management/sales/create"
                    element={<CreateSalesPage />}
                />
                <Route
                    path="management/sales/edit/:id"
                    element={<EditSAlesPage />}
                />


                {/* Catalog */}
                <Route
                    path="/catalog"
                    element={<CatalogPage />}
                />

            </Routes>
        </BrowserRouter>
    );
};
