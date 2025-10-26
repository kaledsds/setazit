import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePagination } from "../hooks/use-pagination";
import type { QueryMeta } from "@/common/common-types";

interface TemplatePaginationButtonsProps {
  meta?: QueryMeta;
}

export const TemplatePaginationButtons: React.FC<
  TemplatePaginationButtonsProps
> = ({ meta }) => {
  const { paginationStates, paginationSetStates } = usePagination();

  const perPageOptions = [5, 10, 15, 25, 50, 100];

  // Calculate total pages from total items and items per page
  const totalPages = Math.ceil(
    (meta?.total || 0) / (meta?.perPage || paginationStates.itemsPerPage),
  );

  const handlePerPageChange = (newPerPage: number) => {
    // Reset to first page when changing per page
    paginationSetStates.setCurrentPage(1);
    paginationSetStates.setItemsPerPage(newPerPage);
  };

  return (
    <div className="flex w-full flex-col items-center justify-end space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      {/* Per Page Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-foreground text-sm">Show:</span>
        <select
          title="itemsPerPage"
          value={paginationStates.itemsPerPage}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          className="bg-card-car rounded-lg border-2 border-[rgba(212,175,55,0.3)] px-3 py-2 text-yellow-500 transition-colors hover:border-yellow-500 focus:border-yellow-500 focus:outline-none"
        >
          {perPageOptions.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-background text-foreground"
            >
              {option}
            </option>
          ))}
        </select>
        <span className="text-foreground text-sm">par page</span>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() =>
            paginationSetStates.setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          disabled={paginationStates.currentPage === 1}
          className="flex items-center space-x-2 rounded-lg border-2 border-yellow-500 bg-transparent px-4 py-2 text-yellow-500 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-yellow-500"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Précédent</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {/* First page */}
          {paginationStates.currentPage > 3 && (
            <>
              <button
                onClick={() => paginationSetStates.setCurrentPage(1)}
                className="h-10 w-10 rounded-lg border-2 border-yellow-500 bg-transparent text-yellow-500 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-black"
              >
                1
              </button>
              {paginationStates.currentPage > 4 && (
                <span className="text-muted-foreground px-2">...</span>
              )}
            </>
          )}

          {/* Current page and surrounding pages */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (paginationStates.currentPage <= 3) {
              pageNum = i + 1;
            } else if (paginationStates.currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = paginationStates.currentPage - 2 + i;
            }

            if (pageNum < 1 || pageNum > totalPages) return null;
            if (
              paginationStates.currentPage > 3 &&
              totalPages > 5 &&
              pageNum === 1
            )
              return null;
            if (
              paginationStates.currentPage < totalPages - 2 &&
              totalPages > 5 &&
              pageNum === totalPages
            )
              return null;

            const isActive = paginationStates.currentPage === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => paginationSetStates.setCurrentPage(pageNum)}
                className={`h-10 w-10 rounded-lg border-2 transition-all ${
                  isActive
                    ? "scale-110 border-yellow-500 bg-yellow-500 font-semibold text-black shadow-lg shadow-yellow-500/30"
                    : "border-yellow-500 bg-transparent text-yellow-500 hover:scale-105 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Last page */}
          {paginationStates.currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {paginationStates.currentPage < totalPages - 3 && (
                <span className="text-muted-foreground px-2">...</span>
              )}
              <button
                onClick={() => paginationSetStates.setCurrentPage(totalPages)}
                className="h-10 w-10 rounded-lg border-2 border-yellow-500 bg-transparent text-yellow-500 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-black"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() =>
            paginationSetStates.setCurrentPage((prev) =>
              Math.min(prev + 1, totalPages),
            )
          }
          disabled={paginationStates.currentPage === totalPages}
          className="flex items-center space-x-2 rounded-lg border-2 border-yellow-500 bg-transparent px-4 py-2 text-yellow-500 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-yellow-500"
        >
          <span>Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
