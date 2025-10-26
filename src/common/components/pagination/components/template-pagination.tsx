import type { QueryMeta } from "@/common/common-types";
import { TemplatePaginationInfo } from "./template-pagination-info";
import { TemplatePaginationButtons } from "./template-pagination-buttons";
import { cn } from "@/lib/utils";

interface PaginationProps {
  meta?: QueryMeta;
  className?: string;
}

export const TemplatePagination: React.FC<PaginationProps> = ({
  className,
  meta,
}) => {
  return (
    <div className={cn("flex items-center justify-between p-2", className)}>
      <TemplatePaginationInfo meta={meta} />
      <TemplatePaginationButtons meta={meta} />
    </div>
  );
};
