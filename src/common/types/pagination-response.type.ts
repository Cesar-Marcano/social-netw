export default class PaginationResponse<T> {
  totalCount!: number;

  data!: T[];
}
