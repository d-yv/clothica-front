// import GoodInfo from "@/components/common/GoodInfo/GoodInfo";
import Hero from "@/components/common/Hero/Hero";
import PopularCategories from "@/components/common/PopularCategories/PopularCategories";
// import ReviewsList from "@/components/common/ReviewsList/ReviewsList";
import Style from "@/components/common/Style/Style";
import LastReviews from "@/components/common/LastReviews/LastReviews";
// import PopularCategories from "@/components/common/PopularCategories/PopularCategories";
// import PopularGoods from "@/components/common/PopularGoods/PopularGoods";
// import ReviewsList from "@/components/common/ReviewsList/ReviewsList";
import PopularGoods from "@/components/common/PopularGoods/PopularGoods";

export default function Home() {
  return (
    <main>
      <Hero />
      <Style />
      <PopularCategories />
      <PopularGoods />
      <LastReviews />
    </main>
  );
}
