import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo_elementAll.png";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const navigation = [
    { name: "Productos", href: "/management/products" },
    { name: "Marcas", href: "/management/brands" },
    { name: "Ventas", href: "/management/sales" },
];

const userNavigation = [
    { name: "Mi perfil", href: "#" },
    { name: "Configuración", href: "#" },
    { name: "Cerrar sesión", href: "logout" },
];

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

    // Solo mantenemos el booleano para bloquear el botón durante el proceso
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
            <Disclosure
                as="nav"
                className="relative z-50 bg-gray-800/50 backdrop-blur-xl"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <img
                                    alt="ElementAll ERP"
                                    src={logo}
                                    className="size-8"
                                />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navigation.map((item) => {
                                        const isCurrent =
                                            location.pathname.startsWith(
                                                item.href,
                                            );
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className={classNames(
                                                    isCurrent
                                                        ? "bg-gray-900 text-white dark:bg-gray-950/50"
                                                        : "text-white hover:bg-white/5",
                                                    "rounded-md px-3 py-2 text-sm font-medium uppercase",
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <button
                                    type="button"
                                    className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                >
                                    <BellIcon className="size-6 cursor-pointer" />
                                </button>

                                <Menu as="div" className="relative ml-3">
                                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <img
                                            alt=""
                                            src={userImage}
                                            className="size-8 rounded-full cursor-pointer"
                                        />
                                    </MenuButton>

                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none border border-white/10">
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                {item.name ===
                                                "Cerrar sesión" ? (
                                                    <button
                                                        onClick={handleLogout}
                                                        disabled={isLoggingOut}
                                                        className={classNames(
                                                            isLoggingOut
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : "cursor-pointer",
                                                            "block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5",
                                                        )}
                                                    >
                                                        {isLoggingOut
                                                            ? "Saliendo..."
                                                            : item.name}
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={item.href}
                                                        className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                                                    >
                                                        {item.name}
                                                    </a>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>

                        <div className="-mr-2 flex md:hidden">
                            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                                <Bars3Icon className="block size-6 group-data-open:hidden" />
                                <XMarkIcon className="hidden size-6 group-data-open:block" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>

                <DisclosurePanel className="md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {navigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as={Link}
                                to={item.href}
                                className={classNames(
                                    location.pathname.startsWith(item.href)
                                        ? "bg-gray-900 text-white"
                                        : "text-white hover:bg-white/5",
                                    "block rounded-md px-3 py-2 text-base font-medium uppercase",
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 pb-3">
                        <div className="flex items-center px-5">
                            <div className="shrink-0">
                                <img
                                    alt=""
                                    src={userImage}
                                    className="size-10 rounded-full"
                                />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">
                                    {user?.name || "Admin"}
                                </div>
                                <div className="text-sm font-medium text-gray-400">
                                    {user?.email}
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            {userNavigation.map((item) => {
                                const isLogout = item.name === "Cerrar sesión";
                                return (
                                    <DisclosureButton
                                        key={item.name}
                                        as={isLogout ? "button" : "a"}
                                        {...(isLogout
                                            ? {}
                                            : { href: item.href })}
                                        onClick={
                                            isLogout
                                                ? (handleLogout as any)
                                                : undefined
                                        }
                                        disabled={isLogout && isLoggingOut}
                                        className={classNames(
                                            isLogout
                                                ? "text-red-400"
                                                : "text-gray-400",
                                            "block w-full text-left rounded-md px-3 py-2 text-base font-medium hover:bg-white/5 hover:text-white",
                                        )}
                                    >
                                        {isLogout && isLoggingOut
                                            ? "Saliendo..."
                                            : item.name}
                                    </DisclosureButton>
                                );
                            })}
                        </div>
                    </div>
                </DisclosurePanel>
            </Disclosure>

            {title && (
                <header className="bg-white shadow-sm dark:bg-gray-800 border-b border-white/10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
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

            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
