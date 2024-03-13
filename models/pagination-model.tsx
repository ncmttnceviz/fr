export interface PaginationModel<T> {
    current_page: number;
    per_page: number;
    total_page: number;
    total: number;
    items:T[];
}