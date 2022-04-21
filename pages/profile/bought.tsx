import type { NextPage } from "next";
import Layout from "../../components/layout";
import ProductsList from "../../components/productList";

const Bought: NextPage = () => {
  return (
    <Layout canGoBack title="구매내역">
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductsList kind="purchase" />
      </div>
    </Layout>
  );
};

export default Bought;