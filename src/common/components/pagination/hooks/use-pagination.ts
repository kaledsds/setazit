import { useContext } from "react";
import { PaginationContext } from "../context/pagination.context";

export function usePagination() {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error(
      "usePagination cannot be used outside of PaginationContextProvider!"
    );
  }
  return context;
}
