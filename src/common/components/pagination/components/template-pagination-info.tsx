import type { QueryMeta } from "@/common/common-types";
import { usePagination } from "../hooks/use-pagination";

interface TemplatePaginationInfoProps {
  meta?: QueryMeta;
}

export const TemplatePaginationInfo: React.FC<TemplatePaginationInfoProps> = ({
  meta,
}) => {
  const { paginationStates, ressourcesName } = usePagination();
  if (!((meta?.total ?? 0) > 1)) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-black dark:text-white">
        Affichage {paginationStates.startIndex + 1} à{" "}
        {Math.min(paginationStates.endIndex, meta?.total ?? 0)} de {meta?.total}{" "}
        {ressourcesName}
      </div>
    </div>
  );
};
