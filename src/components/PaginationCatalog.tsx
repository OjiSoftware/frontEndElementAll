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

        <div className="flex items-center justify-between border-t border-gray-300 px-4 py-4 sm:px-6">

            {/* MOBILE */}
            <div className="sm:hidden w-full flex items-center justify-center gap-4">

                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md text-black bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                >
                    <ChevronLeftIcon className="size-5" />
                </button>

                <span className="text-sm text-black font-medium">
                    Página{" "}
                    <span className="font-bold">
                        {currentPage}
                    </span>{" "}
                    de{" "}
                    <span className="font-bold">
                        {totalPages}
                    </span>
                </span>

                <button
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md text-black bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                >
                    <ChevronRightIcon className="size-5" />
                </button>

            </div>


            {/* DESKTOP */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">

                {/* TEXTO */}
                <div>

                    <p className="text-sm font-lato text-black">

                        Mostrando{" "}

                        <span className="font-bold">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>

                        {" "}a{" "}

                        <span className="font-bold">
                            {Math.min(currentPage * itemsPerPage, totalItems)}
                        </span>

                        {" "}de{" "}

                        <span className="font-bold">
                            {totalItems}
                        </span>

                        {" "}resultados.

                    </p>

                </div>


                {/* BOTONES */}
                <div>

                    <nav className="isolate inline-flex -space-x-px rounded-md">

                        {/* PREV */}
                        <button
                            onClick={() =>
                                onPageChange(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-3 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                        >
                            <ChevronLeftIcon className="size-5" />
                        </button>


                        {/* NUMEROS */}
                        {pages.map((page, i) =>

                            page === "..." ? (

                                <span
                                    key={i}
                                    className="px-4 py-2 bg-white text-black border border-gray-300 font-lato font-medium"
                                >
                                    ...
                                </span>

                            ) : (

                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`
                                        px-4 py-2 font-lato font-bold cursor-pointer transition-all duration-200
                                        ${currentPage === page
                                            ? "bg-gray-200 text-black border border-gray-300 z-10"
                                            : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {page}
                                </button>

                            )

                        )}

                        {/* NEXT */}
                        <button
                            onClick={() =>
                                onPageChange(
                                    Math.min(totalPages, currentPage + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-3 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                        >
                            <ChevronRightIcon className="size-5" />
                        </button>

                    </nav>

                </div>

            </div>

        </div>

    );

}
