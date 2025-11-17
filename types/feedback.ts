export interface Feedback{
  _id: { $oid: string };
  author: string;
  date: string;
  description: string;
  rate: number;
  category: string;
  productId: { $oid: string };
};