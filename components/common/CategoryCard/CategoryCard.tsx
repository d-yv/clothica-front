// "use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/utils/categories";
import { categoryImages } from "@/constants/categoryImages";
import css from "./CategoryCard.module.css";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  // const handleClick = () => {
  //   console.log("Clicked category id:", category.id);
  // };

  return (
    <Link
      //   href={{
      //     pathname: "/goods",
      //     query: { categoryId: category.id },
      //   }}
      //   onClick={handleClick}
      //   className={css.card}
      // >
      href={`/goods?categoryId=${category.id}`}
      // onClick={handleClick}
      className={css.card}
    >
      <div className={css.imageWrapper}>
        <Image
          src={
            categoryImages[category.name] ||
            "/images/categories/placeholder.jpg"
          }
          alt={category.name}
          fill
          className={css.image}
          // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          sizes="(max-width: 767px) 100vw,(max-width: 1439px) 50vw,33vw"
        />
      </div>
      <p className={css.name}>{category.name}</p>
    </Link>
  );
}
