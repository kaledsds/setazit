"use client";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mb-8 flex items-center justify-between rounded-lg border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-4 backdrop-blur">
      <span className="text-foreground text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-foreground rounded-md border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        <select
          title="Select page"
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="text-foreground rounded-md border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-2"
        >
          {pages.map((page) => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-foreground rounded-md border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
