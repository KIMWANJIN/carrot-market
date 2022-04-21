import type { NextPage } from "next";
import Layout from "../../components/layout";
import ProductsList from "../../components/productList";

const Sold: NextPage = () => {
  return (
    <Layout canGoBack title="판매내역">
      <div className="flex flex-col pb-4 divide-y">
        <ProductsList kind="sale" />
      </div>
    </Layout>
  );
};

export default Sold;