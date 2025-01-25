/**
 * Pagination response class used to represent paginated data.
 *
 * @template T The type of the data in the paginated result.
 */
export default class PaginationResponse<T> {
  /**
   * The total count of items available across all pages.
   * This value helps in calculating the total number of pages.
   */
  totalCount!: number;

  /**
   * The actual data for the current page.
   * This is an array of items of type T.
   */
  data!: T[];
}
