// src/App.tsx
import DashboardLayout from "./layouts/DashboardLayout";
import ManagementPage from "./pages/ManagementPage";

export function App() {
    return (
        <DashboardLayout>
            <ManagementPage />
        </DashboardLayout>
    );
}
