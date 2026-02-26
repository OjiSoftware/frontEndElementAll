import { CartProvider } from "./context/CartContext";
import { AppRoutes } from "./routes/AppRoutes";
import ToastProvider from "@/components/ToastProvider";

function App() {
    return (
        <CartProvider>
            <AppRoutes />
            <ToastProvider />
        </CartProvider>
    );
}

export default App;
