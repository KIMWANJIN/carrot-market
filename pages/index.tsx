import { Product } from '@prisma/client';
import type { NextPage } from 'next'
import Head from 'next/head';
import useSWR from 'swr';
import FloatingButton from '../components/floating-button';
import Item from '../components/Items';
import Layout from '../components/layout';
import useUser from '../libs/client/useUser';

export interface ProductWithCount extends Product {
  _count: { fav: number }
}

interface ProductRes {
  ok: boolean
  products: ProductWithCount[] // type is created by prisma (schema) and modified by extends
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser()
  const { data } = useSWR<ProductRes>("/api/products")

  return (
    <Layout title="홈" hasTabBar>
      <Head><title>Home</title></Head>
      <div className='flex flex-col divide-y-[1px]'>
        {data?.products?.map((item) => (
          <Item id={item.id} key={item.id} title={item.name} price={item.price} comments={999} hearts={item._count.fav} photo={item.image} />
        ))}
        <FloatingButton
          href="./items/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
}

export default Home
