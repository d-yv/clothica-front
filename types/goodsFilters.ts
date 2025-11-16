// src/types/goodsFilters.ts
export type GoodsGender = "all" | "female" | "male" | "other";

export type GoodsFilters = {
  categoryId: string | null;
  categoryName: string | null;
  sizes: string[]; // ['xs','m'] и т.п.
  minPrice: number; // от
  maxPrice: number; // до
  gender: GoodsGender;
};
