import { useEffect, useState } from "react";
import { productApi } from "@/services/ProductService";
import { saleApi } from "@/services/SaleService";
import { Sale } from "@/types/sale.types";
import { Product } from "@/types/product.types";
import { ShoppingCart } from "lucide-react";

interface SaleDetailsModalProps {
    isOpen: boolean;
    sale: Sale | null;
    onClose: () => void;
}

export function SaleDetailsModal({
    isOpen,
    sale,
    onClose,
}: SaleDetailsModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [enrichedDetails, setEnrichedDetails] = useState<any[]>([]);
    const [fullSale, setFullSale] = useState<any>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!isOpen || !sale) return;
            setIsLoading(true);
            try {
                const productsData: Product[] =
                    await productApi.getAllProducts();
                const saleData = await saleApi.getById(sale.id.toString());

                setFullSale(saleData);

                const details = saleData?.details || sale.details || [];

                const mappedDetails = details.map((d: any) => {
                    const product = productsData.find(
                        (p: any) => p.id === d.productId,
                    );
                    const price = d.unitaryPrice
                        ? Number(d.unitaryPrice)
                        : Number(product?.price || 0);
                    return {
                        productId: d.productId,
                        name: product?.name || "Producto desconocido",
                        price: price,
                        quantity: d.quantity,
                    };
                });

                setEnrichedDetails(mappedDetails);
            } catch (error) {
                console.error(
                    "Error al cargar los detalles de la venta",
                    error,
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [isOpen, sale]);

    if (!isOpen || !sale) return null;

    const client = fullSale?.client || sale?.client;
    const address = client?.addresses?.[0];

    const formatARS = (amount: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-4xl shadow-2xl text-left transform transition-all duration-200 animate-fade-in max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart className="text-indigo-400" size={24} />
                        Detalles de la Venta #{sale.id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition cursor-pointer text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center py-12">
                        <span className="text-gray-400">
                            Cargando detalles...
                        </span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Info Venta COMPLETA */}
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                                <h3 className="text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-wider">
                                    Detalle del Comprobante
                                </h3>
                                <div className="space-y-2 text-sm text-gray-300">
                                    <p>
                                        <strong className="text-gray-400 font-medium">
                                            Fecha y Hora:
                                        </strong>{" "}
                                        {sale.createdAt
                                            ? new Date(
                                                  sale.createdAt,
                                              ).toLocaleString("es-AR", {
                                                  timeZone:
                                                      "America/Argentina/Buenos_Aires",
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: false,
                                              }) + " hs"
                                            : "Sin fecha"}
                                    </p>
                                    <p>
                                        <strong className="text-gray-400 font-medium">
                                            Estado:
                                        </strong>{" "}
                                        {sale.status}
                                    </p>
                                    <p>
                                        <strong className="text-gray-400 font-medium">
                                            Monto Total:
                                        </strong>{" "}
                                        <span className="text-green-400 font-bold">
                                            {formatARS(Number(sale.total))}
                                        </span>
                                    </p>
                                    {/* Restaurada la lógica de transacción */}
                                    {fullSale?.transaction && (
                                        <p>
                                            <strong className="text-gray-400 font-medium">
                                                Pago:
                                            </strong>{" "}
                                            <span className="text-indigo-300 font-semibold capitalize">
                                                {fullSale.transaction
                                                    .paymentMethod || "N/A"}
                                            </span>
                                            {fullSale.transaction
                                                .cardLastFour && (
                                                <span className="text-xs text-gray-500 ml-1">
                                                    (Terminado en{" "}
                                                    {
                                                        fullSale.transaction
                                                            .cardLastFour
                                                    }
                                                    )
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Datos del Cliente COMPLETOS */}
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                                <h3 className="text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-wider">
                                    Datos del Cliente
                                </h3>
                                {client ? (
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>
                                            <strong className="text-gray-400 font-medium">
                                                Nombre:
                                            </strong>{" "}
                                            {client.name} {client.surname}
                                        </p>
                                        <p>
                                            <strong className="text-gray-400 font-medium">
                                                DNI:
                                            </strong>{" "}
                                            {client.dni || "N/A"}
                                        </p>
                                        <p>
                                            <strong className="text-gray-400 font-medium">
                                                Contacto:
                                            </strong>{" "}
                                            {client.email || "N/A"} |{" "}
                                            {client.phoneNumber || "N/A"}
                                        </p>
                                        {address && (
                                            <div className="pt-1 border-t border-white/5 mt-1">
                                                <p>
                                                    <strong className="text-gray-400 font-medium">
                                                        Dirección:
                                                    </strong>{" "}
                                                    {address.street}{" "}
                                                    {address.streetNum}
                                                    {address.floor
                                                        ? `, Piso ${address.floor}`
                                                        : ""}
                                                    {address.apartment
                                                        ? ` Dpto ${address.apartment}`
                                                        : ""}
                                                </p>
                                                <p>
                                                    <strong className="text-gray-400 font-medium">
                                                        Ubicación:
                                                    </strong>{" "}
                                                    {address.locality},{" "}
                                                    {address.province}
                                                </p>
                                                <p>
                                                    <strong className="text-gray-400 font-medium">
                                                        CP:
                                                    </strong>{" "}
                                                    {address.postalCode ||
                                                        address.zipCode ||
                                                        address.zip_code ||
                                                        "N/A"}{" "}
                                                    |{" "}
                                                    <strong className="text-gray-400 font-medium">
                                                        País:
                                                    </strong>{" "}
                                                    {address.country ||
                                                        "Argentina"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        Cliente no registrado
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tabla Estilo Desktop Centrada */}
                        <div>
                            <h3 className="text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-wider">
                                Productos
                            </h3>
                            <div className="overflow-x-auto bg-slate-800/50 rounded-xl border border-white/10">
                                <table className="w-full text-center text-gray-300 text-sm">
                                    <thead className="text-xs uppercase bg-slate-700/50 text-slate-400">
                                        <tr>
                                            <th className="px-4 py-3 text-left w-12">
                                                #
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Producto
                                            </th>
                                            <th className="px-4 py-3">
                                                Cantidad
                                            </th>
                                            <th className="px-4 py-3">
                                                Precio
                                            </th>
                                            <th className="px-4 py-3">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {enrichedDetails.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-left text-gray-500 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 text-left font-medium text-white">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatARS(item.price)}
                                                </td>
                                                <td className="px-4 py-3 font-bold text-indigo-300">
                                                    {formatARS(
                                                        item.price *
                                                            item.quantity,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end border-t border-slate-700 pt-4">
                    <button
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition cursor-pointer text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
