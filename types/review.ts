export interface Review {
  _id: string;
  author: string;
  description: string; // Обов'язкове для GoodReviews
  rate: number;
  date?: string;
  category?: string;
  productId?: string;
}
