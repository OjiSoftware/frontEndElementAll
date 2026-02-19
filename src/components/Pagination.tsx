import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Genera los botones de página con puntos suspensivos
    const getPages = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    const pages = getPages();

    return (
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
            {/* MOBILE */}
            <div className="sm:hidden w-full flex items-center justify-center gap-4">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md text-gray-400 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronLeftIcon title="Anterior" className="size-5" />
                </button>

                <span className="text-sm text-gray-300 text-center">
                    Página{" "}
                    <span className="text-white font-medium">
                        {currentPage}
                    </span>{" "}
                    de{" "}
                    <span className="text-white font-medium">{totalPages}</span>
                </span>

                <button
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md text-gray-400 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronRightIcon title="Siguiente" className="size-5" />
                </button>
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-300">
                        Mostrando{" "}
                        <span className="text-white font-medium">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        a{" "}
                        <span className="text-white font-medium">
                            {Math.min(currentPage * itemsPerPage, totalItems)}
                        </span>{" "}
                        de{" "}
                        <span className="text-white font-medium">
                            {totalItems}
                        </span>{" "}
                        resultados
                    </p>
                </div>

                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        {/* Prev */}
                        <button
                            onClick={() =>
                                onPageChange(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ChevronLeftIcon className="size-5" />
                        </button>

                        {/* Pages */}
                        {pages.map((page, i) =>
                            page === "..." ? (
                                <span
                                    key={`dots-${i}`}
                                    className="relative inline-flex items-center px-4 py-2 text-sm text-gray-500"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={`page-${page}-${i}`}
                                    onClick={() => onPageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-300
                ${
                    currentPage === page
                        ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white"
                        : "bg-slate-700/90 text-gray-200 hover:bg-indigo-500/20"
                }`}
                                >
                                    {page}
                                </button>
                            ),
                        )}

                        {/* Next */}
                        <button
                            onClick={() =>
                                onPageChange(
                                    Math.min(totalPages, currentPage + 1),
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ChevronRightIcon className="size-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
