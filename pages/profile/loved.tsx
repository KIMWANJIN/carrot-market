import type { NextPage } from "next";
import Layout from "../../components/layout";
import ProductsList from "../../components/productList";

const Loved: NextPage = () => {
  return (
    <Layout canGoBack title="관심목록">
      <div className="flex flex-col space-y-5 pb-10 divide-y">
        <ProductsList kind="fav" />
      </div>
    </Layout>
  );
};

export default Loved;