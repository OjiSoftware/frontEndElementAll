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
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo_elementAll.png";

const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
    { name: "Productos", href: "/management/products" },
    { name: "Marcas", href: "/management/brands" },
    { name: "Ventas", href: "/management/sales" },
];

const userNavigation = [
    { name: "Mi perfil", href: "#" },
    { name: "Configuración", href: "#" },
    { name: "Cerrar sesión", href: "#" },
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <Disclosure
                as="nav"
                className="relative z-50 bg-gray-800/50 backdrop-blur-xl"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <img
                                    alt="Your Company"
                                    src={logo}
                                    className="size-8"
                                />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navigation.map((item) => {
                                        const isCurrent = location.pathname.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                aria-current={
                                                    isCurrent
                                                        ? "page"
                                                        : undefined
                                                }
                                                className={classNames(
                                                    isCurrent
                                                        ? "bg-gray-900 text-white dark:bg-gray-950/50"
                                                        : "text-white hover:bg-white/5 dark:hover:bg-white/5",
                                                    "rounded-md px-3 py-2 text-sm font-medium uppercase",
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Notificaciones y perfil */}
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <button
                                    type="button"
                                    className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">
                                        View notifications
                                    </span>
                                    <BellIcon
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </button>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <MenuButton className="relative flex max-w-xs items-center rounded-full hover:ring-2 hover:ring-white/20 transition">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <img
                                            alt=""
                                            src={user.imageUrl}
                                            className="size-8 rounded-full outline -outline-offset-1 outline-white/10"
                                        />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-999 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg outline-1 outline-white/10"
                                    >
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className="block rounded-md px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                                                >
                                                    {item.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-mr-2 flex md:hidden">
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon
                                    aria-hidden="true"
                                    className="block size-6 group-data-open:hidden"
                                />
                                <XMarkIcon
                                    aria-hidden="true"
                                    className="hidden size-6 group-data-open:block"
                                />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>

                <DisclosurePanel className="md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {navigation.map((item) => {
                            const isCurrent = location.pathname.startsWith(item.href);
                            return (
                                <DisclosureButton
                                    key={item.name}
                                    as={Link}
                                    to={item.href}
                                    aria-current={isCurrent ? "page" : undefined}
                                    className={classNames(
                                        isCurrent
                                            ? "bg-gray-900 text-white dark:bg-gray-950/50"
                                            : "text-white hover:bg-white/5 dark:hover:bg-white/5",
                                        "block rounded-md px-3 py-2 text-base font-medium uppercase",
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            )
                        })}
                    </div>
                    <div className="border-t border-white/10 pt-4 pb-3 px-2">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    {/* Botón Mi cuenta */}
                                    <DisclosureButton className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/5 transition">
                                        <span>Mi cuenta</span>

                                        <svg
                                            className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""
                                                }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </DisclosureButton>

                                    {/* PANEL */}
                                    <DisclosurePanel className="mt-3 space-y-3">
                                        {/* Usuario */}
                                        <div className="flex items-center px-3">
                                            <img
                                                src={user.imageUrl}
                                                className="size-9 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {user.email}
                                                </div>
                                            </div>

                                            <BellIcon className="ml-auto size-5 text-gray-400 hover:text-white transition" />
                                        </div>

                                        {/* Opciones */}
                                        <div className="space-y-1">
                                            {userNavigation.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="block rounded-md px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                    </div>

                    {/* <div className="border-t border-white/10 pt-4 pb-3">
                        <div className="flex items-center px-5">
                            <div className="shrink-0">
                                <img
                                    alt=""
                                    src={user.imageUrl}
                                    className="size-10 rounded-full outline -outline-offset-1 outline-white/10"
                                />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">
                                    View notifications
                                </span>
                                <BellIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </button>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            {userNavigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-white/5 hover:text-white dark:text-gray-400 dark:hover:bg-white/5"
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                    </div> */}
                </DisclosurePanel>
            </Disclosure>

            {/* Header */}
            {title && (
                <header className="relative bg-white shadow-sm dark:bg-gray-800 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:inset-y-0 dark:after:border-y dark:after:border-white/10">
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

            {/* Main content */}
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
