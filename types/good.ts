import { GoodsGender } from "./goodsGender";

export interface Good {
  _id: string;
  name: string;
  image: string;
  categoryName: string;
  averageRate: number;
  feedbackCount: number;
  price: {
    value: number;
    currency: string;
  };
  size: string[];
  description: string;
  prevDescription: string;
  gender: GoodsGender;
  characteristics: string[];
}



export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
