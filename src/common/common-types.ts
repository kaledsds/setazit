/**
 * Base model
 */
export interface BaseModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryMeta {
  total?: number;
  lastPage?: number;
  currentPage?: number;
  perPage?: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}
