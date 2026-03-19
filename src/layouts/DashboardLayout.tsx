import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon, // Agregado para el móvil
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/OJI_logo/oji_logo_color.svg";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

const navigation = [
    { name: "Productos", href: "/management/products" },
    { name: "Marcas", href: "/management/brands" },
    { name: "Ventas", href: "/management/sales" },
];

/* const userNavigation = [
    { name: "Mi perfil", href: "#" },
    { name: "Configuración", href: "#" },
    { name: "Cerrar sesión", href: "logout" },
]; */

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({
    children,
    title,
    subtitle,
    actions,
}: {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        document.body.classList.add("bg-gray-900");

        return () => {
            document.body.classList.remove("bg-gray-900");
        };
    }, []);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoggingOut(true);

        try {
            await Promise.all([
                logout(),
                new Promise((resolve) => setTimeout(resolve, 400)),
            ]);

            navigate("/auth/login", { replace: true });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            navigate("/auth/login", { replace: true });
        }
    };

    const userImage =
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(user?.name || "Admin") +
        "&background=6366f1&color=fff";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* NAVBAR ESCRITORIO */}
            <nav className="relative z-50 bg-gray-800/50 backdrop-blur-xl hidden md:block border-b border-white/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0 flex items-center">
                                <img
                                    alt="OJI"
                                    src={logo}
                                    className="size-16"
                                />
                            </div>
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navigation.map((item) => {
                                    const isCurrent = location.pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={classNames(
                                                isCurrent
                                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                    : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent",
                                                "rounded-lg px-4 py-2 text-sm font-medium uppercase transition-all"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="ml-4 flex items-center md:ml-6">
                            <Menu as="div" className="relative ml-3">
                                <MenuButton className="relative flex max-w-xs items-center justify-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-shadow">
                                    <img
                                        alt=""
                                        src={userImage}
                                        className="size-9 rounded-full object-cover border border-white/10"
                                    />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-white/10 rounded-xl bg-gray-800/95 backdrop-blur-md shadow-2xl ring-1 ring-black/5 focus:outline-none border border-white/10 transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in overflow-hidden"
                                >
                                    <div className="px-4 py-3 bg-gray-900/40">
                                        <p className="text-sm text-white font-medium truncate">
                                            {user?.name || "Admin"}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        <MenuItem>
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className={classNames(
                                                    isLoggingOut
                                                        ? "opacity-100 cursor-not-allowed"
                                                        : "cursor-pointer",
                                                    "group flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                                )}
                                            >
                                                <ArrowRightOnRectangleIcon
                                                    className="mr-3 size-5 text-red-400/80 group-hover:text-red-400"
                                                    aria-hidden="true"
                                                />
                                                {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
                                            </button>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                </div>
            </nav>

            {/* NAVBAR MÓVIL */}
            <div className="block md:hidden [zoom:0.75]">
                <Disclosure
                    as="nav"
                    className="relative z-50 bg-gray-800/95 backdrop-blur-xl border-b border-white/10 "
                >
                    <div className="mx-auto px-4 sm:px-6">
                        <div className="flex h-14 items-center justify-between">
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <img
                                        alt="OJI"
                                        src={logo}
                                        className="h-8 w-auto"
                                    />
                                </div>
                            </div>

                            <div className="-mr-2 flex items-center">
                                <DisclosureButton className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors">
                                    <span className="sr-only">Abrir menú principal</span>
                                    <Bars3Icon className="block size-8 group-data-open:hidden" aria-hidden="true" />
                                    <XMarkIcon className="hidden size-8 group-data-open:block" aria-hidden="true" />
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="border-t border-white/10 bg-gray-900 shadow-2xl">
                        <div className="space-y-1 px-3 py-3">
                            {navigation.map((item) => {
                                const isCurrent = location.pathname.startsWith(item.href);
                                return (
                                    <DisclosureButton
                                        key={item.name}
                                        as={Link}
                                        to={item.href}
                                        className={classNames(
                                            isCurrent
                                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent",
                                            "block rounded-lg px-4 py-3 text-base font-medium uppercase transition-all"
                                        )}
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                )
                            })}
                        </div>

                        <div className="border-t border-white/10 pb-4 pt-4 bg-gray-800/30">
                            <div className="flex items-center justify-between px-5">
                                <div className="flex items-center min-w-0 flex-1">
                                    <div className="shrink-0">
                                        <img
                                            alt=""
                                            src={userImage}
                                            className="size-10 rounded-full border border-white/10 object-cover"
                                        />
                                    </div>
                                    <div className="ml-3 min-w-0 flex-1">
                                        <div className="text-base font-medium text-white truncate">
                                            {user?.name || "Admin"}
                                        </div>
                                        <div className="text-sm font-medium text-gray-400 truncate mt-0.5">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    title="Cerrar sesión"
                                    className={classNames(
                                        isLoggingOut
                                            ? "opacity-100 cursor-not-allowed"
                                            : "hover:bg-red-500/10 hover:text-red-300",
                                        "ml-4 shrink-0 rounded-full p-2.5 text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                    )}
                                >
                                    <span className="sr-only">Cerrar sesión</span>
                                    <ArrowRightOnRectangleIcon className="size-6" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>

            {title && (
                <header className="bg-white shadow-sm dark:bg-gray-800 border-b border-white/10 [zoom:0.7] md:[zoom:1]">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-sm text-gray-400 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {actions && <div>{actions}</div>}
                    </div>
                </header>
            )}

            <main className="[zoom:0.8] md:[zoom:1]">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
