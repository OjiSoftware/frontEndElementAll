import { useEffect, useState, useMemo } from "react";
import { productApi } from "@/services/ProductService";
import { saleApi } from "@/services/SaleService";
import { Sale } from "@/types/sale.types";
import { Product } from "@/types/product.types";
import { PencilIcon, ShoppingCart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface SaleDetailsModalProps {
    isOpen: boolean;
    sale: Sale | null;
    onClose: () => void;
}

// Mantenemos la misma fuente de la verdad visual que en la tabla
const SALE_STATUS_MAP: Record<string, { label: string; style: string }> = {
    PENDING: {
        label: "Pendiente",
        style: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    IN_PROGRESS: {
        label: "En curso",
        style: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
    COMPLETED: {
        label: "Completada",
        style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    CANCELLED: {
        label: "Cancelada",
        style: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
};

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

    const formatARS = useMemo(
        () =>
            new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
            }),
        [],
    );

    if (!isOpen || !sale) return null;

    const client = fullSale?.client || sale?.client;
    const address = client?.addresses?.[0];
    const notes = fullSale?.notes || (sale as any)?.notes;
    const currentStatus = fullSale?.status || sale.status;

    // Obtenemos el estilo y etiqueta del estado actual (con un fallback seguro)
    const statusInfo = SALE_STATUS_MAP[currentStatus] || {
        label: currentStatus,
        style: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 border-t md:border border-slate-700 rounded-t-3xl md:rounded-xl p-4 md:p-6 w-full max-w-4xl shadow-2xl text-left transform transition-all duration-300 animate-slide-up md:animate-fade-in flex flex-col h-[90vh] md:h-auto md:min-h-[600px] md:max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-slate-700 pb-3 md:pb-4 shrink-0">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart className="text-indigo-400" size={20} />
                        Detalles de la venta
                        <span className="tracking-wider">#{sale.id}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition cursor-pointer text-2xl md:text-3xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center py-12">
                        <span className="text-gray-400 text-sm md:text-base animate-pulse">
                            Cargando detalles...
                        </span>
                    </div>
                ) : (
                    <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {/* ALERTA CRÍTICA (Pagos tardíos, etc.) */}
                        {notes && (
                            <div className="bg-amber-500/10 border border-amber-500/50 p-3 md:p-4 rounded-lg flex items-start gap-3 mb-2 animate-pulse shadow-sm shadow-amber-500/5">
                                <div className="bg-amber-500/20 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-amber-500 font-bold text-xs md:text-sm uppercase tracking-wide mb-1">
                                        Atención Requerida
                                    </h4>
                                    <p className="text-amber-100/80 text-xs md:text-sm leading-relaxed">
                                        {notes}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {/* Info Venta COMPLETA */}
                            <div className="bg-slate-700/30 p-3 md:p-4 rounded-lg border border-slate-600/50">
                                <h3 className="text-xs md:text-sm font-semibold text-indigo-400 mb-2 md:mb-3 uppercase tracking-wider border-b border-white/10 pb-1">
                                    Detalle del Comprobante
                                </h3>
                                <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-300">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 font-medium">
                                            Estado:
                                        </span>
                                        {/* BADGE SINCRONIZADO CON LA TABLA */}
                                        <span
                                            className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold border inline-block uppercase tracking-wider ${statusInfo.style}`}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    <p>
                                        <strong className="text-gray-400 font-medium">
                                            Fecha y hora:
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

                                    {fullSale?.transaction && (
                                        <p className="flex items-center flex-wrap gap-1">
                                            <strong className="text-gray-400 font-medium">
                                                Pago:
                                            </strong>{" "}
                                            <span className="text-indigo-300 font-semibold capitalize">
                                                {fullSale.transaction
                                                    .paymentMethod || "N/A"}
                                            </span>
                                            {fullSale.transaction
                                                .cardLastFour && (
                                                <span className="text-[10px] md:text-xs text-gray-400 bg-slate-800 px-1.5 ml-0.5 rounded border border-slate-600">
                                                    (***{" "}
                                                    {
                                                        fullSale.transaction
                                                            .cardLastFour
                                                    }
                                                    )
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    <div className="pt-2 border-t border-slate-600/30 mt-2">
                                        <p className="flex justify-between items-center text-sm md:text-base">
                                            <strong className="text-gray-400 font-medium">
                                                Monto total:
                                            </strong>{" "}
                                            <span className="text-emerald-400 font-bold px-2 py-1">
                                                {formatARS.format(
                                                    Number(sale.total),
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Datos del Cliente COMPLETOS */}
                            <div className="bg-slate-700/30 p-3 md:p-4 rounded-lg border border-slate-600/50">
                                <h3 className="text-xs md:text-sm font-semibold text-indigo-400 mb-2 md:mb-3 uppercase tracking-wider border-b border-white/10 pb-1">
                                    Datos del Cliente
                                </h3>
                                {client ? (
                                    <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
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
                                        <p
                                            className="truncate"
                                            title={`${client.email} | ${client.phoneNumber}`}
                                        >
                                            <strong className="text-gray-400 font-medium">
                                                Contacto:
                                            </strong>{" "}
                                            {client.email || "N/A"} |{" "}
                                            {client.phoneNumber || "N/A"}
                                        </p>
                                        {address && (
                                            <div className="pt-1 md:pt-2 border-t border-slate-600/50 mt-1 md:mt-2">
                                                <p
                                                    className="truncate"
                                                    title={`${address.street} ${address.streetNum}`}
                                                >
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
                                                    <span className="text-gray-500 mx-1">
                                                        |
                                                    </span>{" "}
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
                                    <p className="text-xs md:text-sm text-gray-400 italic">
                                        Cliente no registrado
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tabla Estilo Desktop Centrada */}
                        <div>
                            <h3 className="text-xs md:text-sm font-semibold text-indigo-400 mb-2 md:mb-3 uppercase tracking-wider border-b border-white/10 pb-1">
                                Productos
                            </h3>
                            <div className="overflow-x-auto bg-slate-800/50 rounded-xl border border-slate-600/50">
                                <table className="w-full text-center text-gray-300 text-xs md:text-sm whitespace-nowrap md:whitespace-normal">
                                    <thead className="text-[10px] md:text-xs uppercase bg-slate-700/50 text-slate-400">
                                        <tr>
                                            <th className="px-3 md:px-4 py-2 md:py-3 text-left w-8 md:w-12">
                                                #
                                            </th>
                                            <th className="px-3 md:px-4 py-2 md:py-3 text-left">
                                                Producto
                                            </th>
                                            <th className="px-3 md:px-4 py-2 md:py-3">
                                                Cant.
                                            </th>
                                            <th className="px-3 md:px-4 py-2 md:py-3">
                                                Precio
                                            </th>
                                            <th className="px-3 md:px-4 py-2 md:py-3">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-600/50">
                                        {enrichedDetails.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="px-3 md:px-4 py-2 md:py-3 text-left text-gray-500 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td
                                                    className="px-3 md:px-4 py-2 md:py-3 text-left font-medium text-white max-w-[150px] md:max-w-none truncate"
                                                    title={item.name}
                                                >
                                                    {item.name}
                                                </td>
                                                <td className="px-3 md:px-4 py-2 md:py-3">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-3 md:px-4 py-2 md:py-3">
                                                    {formatARS.format(
                                                        item.price,
                                                    )}
                                                </td>
                                                <td className="px-3 md:px-4 py-2 md:py-3 font-bold text-indigo-300">
                                                    {formatARS.format(
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

                {/* Footer */}
                <div className="mt-4 md:mt-6 flex justify-end border-t border-slate-700 pt-4 gap-2 md:gap-3 shrink-0">
                    <button
                        className="px-4 md:px-6 py-3 md:py-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition cursor-pointer text-sm flex-1 md:flex-none"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                    <Link
                        to={ROUTES.sales.edit(Number(sale?.id))}
                        className="px-4 md:px-6 py-3 md:py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-400 transition cursor-pointer text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 flex-1 md:flex-none"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Editar
                    </Link>
                </div>
            </div>
        </div>
    );
}
