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
  gender: string;
  characteristics: string[];
}
