import { createContext, memo, useMemo, useState } from "react";

interface PaginationContextProps {
  paginationStates: {
    currentPage: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
  };
  paginationSetStates: {
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  };
  ressourcesName?: string;
}

export const PaginationContext = createContext<PaginationContextProps | null>(
  null
);

interface PaginationContextProviderProps {
  children: React.ReactNode;
  ressourcesName?: string;
}

export const PaginationContextProvider: React.FC<PaginationContextProviderProps> =
  memo(({ children, ressourcesName }) => {
    /**
     * States
     */
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    /**
     * Computed values
     */
    const startIndex = useMemo(
      () => (currentPage - 1) * itemsPerPage,
      [currentPage, itemsPerPage]
    );
    const endIndex = useMemo(
      () => startIndex + itemsPerPage,
      [startIndex, itemsPerPage]
    );
    /**
     * Context value
     */
    const contextValue: PaginationContextProps = useMemo(
      () => ({
        paginationStates: {
          currentPage,
          itemsPerPage,
          startIndex,
          endIndex,
        },
        paginationSetStates: {
          setCurrentPage,
          setItemsPerPage,
        },

        ressourcesName,
      }),
      [currentPage, itemsPerPage, startIndex, endIndex, ressourcesName]
    );

    return (
      <PaginationContext.Provider value={contextValue}>
        {children}
      </PaginationContext.Provider>
    );
  });
PaginationContextProvider.displayName = "PaginationContextProvider";
