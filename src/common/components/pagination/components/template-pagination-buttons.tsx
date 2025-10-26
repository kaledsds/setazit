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
        <span className="text-sm text-black dark:text-white">Show:</span>
        <select
          title="itemsPerPage"
          value={paginationStates.itemsPerPage}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          className="rounded-lg border-2 border-yellow-500/20 px-3 py-2 text-yellow-500 focus:border-yellow-500 focus:outline-none"
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-black dark:text-white">per page</span>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() =>
            paginationSetStates.setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          disabled={paginationStates.currentPage === 1}
          className="flex items-center space-x-2 rounded-lg border-2 border-yellow-500 px-4 py-2 text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {/* First page */}
          {paginationStates.currentPage > 3 && (
            <>
              <button
                onClick={() => paginationSetStates.setCurrentPage(1)}
                className={`h-10 w-10 rounded-lg transition-colors ${
                  paginationStates.currentPage === 1
                    ? "bg-yellow-400 text-yellow-500 hover:bg-yellow-500"
                    : "border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                }`}
              >
                1
              </button>
              {paginationStates.currentPage > 4 && (
                <span className="px-2 text-gray-500">...</span>
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

            return (
              <button
                key={pageNum}
                onClick={() => paginationSetStates.setCurrentPage(pageNum)}
                className={`h-10 w-10 rounded-lg transition-colors ${
                  paginationStates.currentPage === pageNum
                    ? "bg-yellow-400 text-yellow-500 hover:bg-yellow-500"
                    : "border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
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
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => paginationSetStates.setCurrentPage(totalPages)}
                className={`h-10 w-10 rounded-lg transition-colors ${
                  paginationStates.currentPage === totalPages
                    ? "bg-yellow-400 text-yellow-500 hover:bg-yellow-500"
                    : "border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                }`}
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
          className="flex items-center space-x-2 rounded-lg border-2 border-yellow-500 px-4 py-2 text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
