import axios from "axios";
import { BACKEND_URL } from "@/constants/api";

export interface CategoryFromBackend {
  _id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const url = `${BACKEND_URL.replace(/\/$/, "")}/api/categories`;

  console.log(`Завантаження категорій з: ${url}`);

  try {
    const { data } = await axios.get(url);
    const categoriesData: CategoryFromBackend[] = data?.categories || [];

    if (!Array.isArray(categoriesData)) {
      console.error("Неправильний формат відповіді:", data);
      throw new Error("Очікувався масив у полі 'categories'.");
    }

    return categoriesData.map((item) => ({
      id: item._id,
      name: item.name,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios помилка:", error.response?.status, error.message);
    } else {
      console.error("Невідома помилка:", error);
    }
    throw new Error("Не вдалося завантажити категорії");
  }
}
