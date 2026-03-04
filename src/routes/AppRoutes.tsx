import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductsPage from "@/pages/management/products";
import CreateProductPage from "@/pages/management/products/CreateProductPage";
import EditProductPage from "@/pages/management/products/EditProductPage";

import BrandsPage from "@/pages/management/brands";
import CreateBrandPage from "@/pages/management/brands/CreateBrandPage";
import EditBrandPage from "@/pages/management/brands/EditBrandPage";

import SalesPage from "@/pages/management/sales";
import CreateSalesPage from "@/pages/management/sales/CreateSalesPage";
import EditSAlesPage from "@/pages/management/sales/EditSalesPage";

import CatalogPage from "@/pages/public/catalog";
import HomePage from "@/pages/public";
import CartPage from "@/pages/public/cart";
import LoginPage from "@/pages/auth";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* HOME */}
                <Route path="/" element={<HomePage />} />

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
                    path="/management/sales/create"
                    element={<CreateSalesPage />}
                />
                <Route
                    path="/management/sales/edit/:id"
                    element={<EditSAlesPage />}
                />

                {/* Catalog */}
                <Route path="/catalog" element={<CatalogPage />} />

                {/* Shopping Cart */}
                <Route path="/cart" element={<CartPage />} />

                {/* Login */}
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
};
