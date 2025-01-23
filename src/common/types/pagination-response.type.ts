export default interface PaginationResponse<T> {
  totalCount: number;
  data: T[];
}
