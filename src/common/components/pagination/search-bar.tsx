import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-3xl">
        <div className="flex items-center gap-0 overflow-hidden rounded-full bg-white shadow-lg">
          <div className="pointer-events-none absolute left-6 flex items-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Search for your dream car..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full bg-white pr-20 pl-14 text-base text-gray-700 placeholder-gray-400 outline-none"
          />

          <button
            className="rounded--full bg-[linear-gradient(45deg,var(--accent-gold),var(--accent-gold-light))] px-4 py-4 text-black shadow-md transition hover:scale-105"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
