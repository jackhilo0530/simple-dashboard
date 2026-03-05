import React, { useEffect, useState } from 'react';
import "../index.css";

interface SearchFormProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
    debounceMs?: number;
}

const SearchForm: React.FC<SearchFormProps> = ({
    onSearch,
    placeholder = "Search...",
    className = "",
    debounceMs = 250,
}) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handler = window.setTimeout(() => {
            if (query !== "") {
                onSearch(query);
            }
        }, debounceMs);
        return () => clearTimeout(handler);
    }, [query, onSearch, debounceMs]);

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); onSearch(query); }}
            role="search"
            aria-label="Site search"
            className='search-form relative'
        >
            <label htmlFor="search-input" className='hidden'>Search</label>
            <input
                type="search"
                id='search-input'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`h-11 w-full rounded-lg border appearance-none 
                    px-4 pr-10 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 bg-transparent
                    text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 ${className}`}
                placeholder={placeholder}
            />
            {query && (
                <button
                    type="button"
                    onClick={() => { setQuery(""); onSearch(""); }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 bg-transparent border-0"
                >
                    ×
                </button>
            )}
            <button type="submit" className='hidden' aria-label='Submit search'>Search</button>
        </form>
    );
}

export default SearchForm;