import { useState, useEffect } from "react";
import { productApi } from "@/services/ProductService";
import { saleApi } from "@/services/SaleService";
import { Product } from "@/types/product.types";

export const useSaleEdit = (saleId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    status: "PENDING",
    total: 0,
    details: [] as any[],
    name: "",
    surname: "",
    dni: "",
    phoneNumber: "",
    email: "",
    street: "",
    number: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    floor: "",
    apartment: "",
    reference: "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (!saleId) return;
      try {
        setIsLoading(true);
        const [productsData, saleData] = await Promise.all([
          productApi.getAllProducts(),
          saleApi.getById(saleId)
        ]);

        setProducts(productsData);

        if (saleData) {
          setClientId(saleData.clientId);
          const address = saleData.client?.addresses?.[0] || {};

          const mappedDetails = saleData.details.map((d: any) => {
            const product = productsData.find((p: any) => p.id === d.productId);

            const price = d.unitaryPrice ? Number(d.unitaryPrice) : Number(product?.price || 0);
            return {
              productId: d.productId,
              name: product?.name || "Producto desconocido",
              price: price,
              quantity: d.quantity
            };
          });

          setFormData({
            status: saleData.status || "PENDING",
            total: Number(saleData.total) || 0,
            details: mappedDetails,
            name: saleData.client?.name || "",
            surname: saleData.client?.surname || "",
            dni: saleData.client?.dni || "",
            phoneNumber: saleData.client?.phoneNumber || "",
            email: saleData.client?.email || "",
            street: address.street || "",
            number: address.streetNum ? address.streetNum.toString() : "",
            city: address.locality || "",
            province: address.province || "",
            postalCode: "", // Dejado por UI compliance
            country: "",
            floor: address.floor ? address.floor.toString() : "",
            apartment: address.apartment || "",
            reference: address.reference || "",
          });
        }
      } catch (error) {
        console.error("Error cargando la venta", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [saleId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          price: Number(product.price),
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
  const updateProductQuantity = (productId: number, quantity: number) => {
    setFormData((prev) => {
      if (quantity < 1) return prev; // Don't allow less than 1 here

      const newDetails = prev.details.map(d =>
        d.productId === productId ? { ...d, quantity } : d
      );

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
    updateProductQuantity,
    isLoading,
    clientId
  };
};
