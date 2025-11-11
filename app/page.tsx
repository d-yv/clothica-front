import GoodInfo from "@/components/common/GoodInfo/GoodInfo";
import Hero from "@/components/common/Hero/Hero";
//import ReviewsList from "@/components/common/ReviewsList/ReviewsList";
import Style from "@/components/common/Style/Style";
import CategoriesList from "@/components/common/CategoriesList/CategoriesList";
// import PopularCategories from "@/components/common/PopularCategories/PopularCategories";
// import PopularGoods from "@/components/common/PopularGoods/PopularGoods";
// import ReviewsList from "@/components/common/ReviewsList/ReviewsList";

export default function Home() {
  return (
    <main>
      <Hero />
      <Style />
      <CategoriesList />
      {/* <PopularCategories /> */}
      <GoodInfo />
      
      {/* <ReviewsList /> */}
    </main>
  );
}
