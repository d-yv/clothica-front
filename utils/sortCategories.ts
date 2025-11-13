import { Category } from "@/utils/categories";

export function sortCategories(categories: Category[]): Category[] {
  const sorted = [...categories];
  const idx = sorted.findIndex((c) => c.name === "Інше");
  if (idx > -1) {
    const [other] = sorted.splice(idx, 1);
    sorted.push(other);
  }
  return sorted;
}
