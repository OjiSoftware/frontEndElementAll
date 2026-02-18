import { AppRoutes } from "./routes/AppRoutes";
import ToastProvider from "@/components/ToastProvider";

function App() {
    return (
        <>
            <AppRoutes />
            <ToastProvider />
        </>
    );
}

export default App;
