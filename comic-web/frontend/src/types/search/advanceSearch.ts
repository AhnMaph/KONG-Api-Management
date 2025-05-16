
export type GenreState = 0 | 1 | 2; // 0: not chosen, 1: include, 2: exclude
export interface AdvancedFilter {
  genres: Record<string, GenreState>; // { genreId: state }
  author?: string;
  status?: string;
  minChapters?: number;
  maxChapters?: number;
}
export const STATUS_OPTIONS: Record<string, string> = {
  ongoing: "Đang tiến hành",
  completed: "Đã hoàn thành",
  paused: "Tạm dừng",
  unverified: "Chưa xác minh",
};
