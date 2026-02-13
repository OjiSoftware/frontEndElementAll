import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-300">
                        Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
                        <span className="font-medium">{totalItems}</span> resultados
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-white/5 disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            <ChevronLeftIcon className="size-5" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => onPageChange(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1
                                    ? "z-10 bg-indigo-500 text-white"
                                    : "text-gray-200 ring-1 ring-inset ring-gray-700 hover:bg-white/5"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-white/5 disabled:opacity-50"
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRightIcon className="size-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}