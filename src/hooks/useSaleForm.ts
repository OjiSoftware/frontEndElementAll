import { useState, useEffect } from "react";
import { productApi } from "@/services/ProductService";
import { Product } from "@/types/product.types";

export const useSaleForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Empieza cargando
  const [formData, setFormData] = useState({
    status: "PENDING",
    total: 0,
    details: [] as any[],
    name: "",
    surname: "",
    dni: "",
    phoneNumber: "",
    email: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await productApi.getAllProducts(); //
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setIsLoading(false); // Terminó la carga, sea con éxito o error
      }
    };
    loadData();
  }, []);

  // Función para manejar cambios en inputs simples (si los tienes)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lógica para el Selector de Productos
  const addProductToSale = (product: Product) => {
    setFormData((prev) => {
      const existingItem = prev.details.find(d => d.productId === product.id);

      let newDetails;
      if (existingItem) {
        newDetails = prev.details.map(d =>
          d.productId === product.id ? { ...d, quantity: d.quantity + 1 } : d
        );
      } else {
        newDetails = [...prev.details, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }];
      }

      const newTotal = newDetails.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
      const roundedTotal = Number(newTotal.toFixed(2));

      return {
        ...prev,
        details: newDetails,
        total: roundedTotal
      };
    });
  };


  return {
    formData,
    setFormData,
    products,
    handleChange,
    addProductToSale,
    isLoading,
  };
};