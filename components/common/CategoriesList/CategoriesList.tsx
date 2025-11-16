import { Category } from "@/utils/categories";
import CategoryCard from "../CategoryCard/CategoryCard";
import css from "./CategoriesList.module.css";

interface Props {
  categories: Category[];
}

export default function CategoriesList({ categories }: Props) {
  return (
    <div className={css.gridWrapper}>
      <ul className={css.grid}>
        {categories.map((cat) => (
          <li key={cat.id} className={css.item}>
            <CategoryCard category={cat} />
          </li>
        ))}
      </ul>
    </div>
  );
}
