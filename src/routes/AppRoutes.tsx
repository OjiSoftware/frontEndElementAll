import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
import RecoverPasswordPage from "@/pages/auth/RecoverPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ContactoPage from "@/pages/public/contacto";
import ArrepentimientoPage from "@/pages/public/legal/ArrepentimientoPage";
import LibroQuejasPage from "@/pages/public/legal/LibroQuejasPage";
import TerminosPage from "@/pages/public/legal/TerminosPage";
import PrivacidadPage from "@/pages/public/legal/PrivacidadPage";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* RUTAS PÚBLICAS (Clientes y Visitantes) */}

                {/* HOME */}
                <Route path="/" element={<HomePage />} />

                {/* Contacto */}
                <Route path="/contacto" element={<ContactoPage />} />

                {/* Legales */}
                <Route
                    path="/arrepentimiento"
                    element={<ArrepentimientoPage />}
                />
                <Route path="/libro-quejas" element={<LibroQuejasPage />} />
                <Route
                    path="/terminos-condiciones"
                    element={<TerminosPage />}
                />
                <Route
                    path="/politicas-privacidad"
                    element={<PrivacidadPage />}
                />

                {/* Catalog */}
                <Route path="/catalogo" element={<CatalogPage />} />

                {/* Shopping Cart */}
                <Route path="/cart" element={<CartPage />} />

                {/* Auth Flow */}
                <Route path="/auth/login" element={<LoginPage />} />
                {/* 👇 AGREGADAS: Rutas de recuperación */}
                <Route path="/auth/recover" element={<RecoverPasswordPage />} />
                <Route
                    path="/auth/reset/:token"
                    element={<ResetPasswordPage />}
                />

                {/* RUTAS PRIVADAS (Solo Administradores - ERP) */}
                <Route element={<ProtectedRoute />}>
                    {/* PRODUCTS */}
                    <Route
                        path="/management/products"
                        element={<ProductsPage />}
                    />
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
