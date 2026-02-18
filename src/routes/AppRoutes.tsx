import CreateProductPage from '@/pages/CreatePage';
import EditProductPage from '@/pages/EditPage';
import ManagementPage from '@/pages/ManagementPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<ManagementPage />} />
                <Route path='/management' element={<ManagementPage />} />
                <Route path='/edit' element={<ManagementPage />} />
                <Route path='/edit/:id' element={<EditProductPage />} />
                <Route path='/createProduct' element={<CreateProductPage />} />


            </Routes>
        </BrowserRouter>
    );
}