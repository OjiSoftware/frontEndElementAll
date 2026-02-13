import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { SearchBarProps } from "@/types/search.types";

export default function SearchBar({
    value,
    onChange,
    placeholder = "Buscar productos",
}: Pick<SearchBarProps, "value" | "onChange" | "placeholder">) {
    return (
        <div className="relative w-full max-w-3xl">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 pl-10 pr-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}
