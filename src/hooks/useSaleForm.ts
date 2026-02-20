import { useState, useEffect } from "react";
import { Sale } from "@/types/sale.types";
import { saleApi } from "@/services/SaleService";
import { Product } from "@/types/product.types";
import { productApi } from "@/services/ProductService";

export const useSaleForm = () => {
  const [formData, setFormData] = useState({
    status: "PENDING",
    client: null,
    total: 0,
    details: [],
  });
  
  const [products, setProducts] = useState<Product[]>([]);



  useEffect(() => {
    const loadData = async () => {
      
      try {
        const products = await productApi.getAllProducts();
        setProducts(products);

      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    

    }));
  };
  )


  return {
    formData,
    setFormData,
    products,
    setProducts,
  };
};