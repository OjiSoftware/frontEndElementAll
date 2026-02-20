const BASE_URL = "http://localhost:3000/api";

export const clientApi = {
  create: async (data: any) => {
    const response = await fetch(`${BASE_URL}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear el cliente");
    return response.json();
  },

  getAllClients: async () => {
    const response = await fetch(`${BASE_URL}/clients`);
    if (!response.ok) throw new Error("Error al traer los clientes");
    return response.json();
  }
};
