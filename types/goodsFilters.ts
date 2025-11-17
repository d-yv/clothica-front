import { GoodsGender } from "./goodsGender";

export type GoodsFilters = {
  categoryId: string | null;
  categoryName?: string | null;
  sizes: string[]; 
  minPrice: number;
  maxPrice: number; 
  gender: GoodsGender;
};
