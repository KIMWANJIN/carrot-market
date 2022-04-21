import { Product, User } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Button from "../../components/button";
import Layout from "../../components/layout";
import useMutation from "../../libs/client/useMutation";
import useUser from "../../libs/client/useUser";
import { jcn } from "../../libs/client/utils";
import Id from "../api/products/[id]";
import client from "../../libs/server/prismaClient"

interface ProductWithUser extends Product {
  user: User
}

interface ItemDetailRes {
  ok: boolean
  product: ProductWithUser
  relatedProducts: Product[]
  isFav: boolean
}

const ItemDetail: NextPage<ItemDetailRes> = ({product, relatedProducts, isFav}) => {
  const router = useRouter()
  const { data, mutate } = useSWR<ItemDetailRes>(router.query.id ? `/api/products/${router.query.id}` : null)
  const [setFav] = useMutation(`/api/products/${router.query.id}/fav`)
  const onFavClick = () => {
    if (!data) return;
    // Just mutate some data in all data in cache by SWR. if want to api call and reupdate, last argument should be true
    mutate({ ...data, isFav: !data.isFav }, false)
    setFav({});
  }
  return (
    <Layout canGoBack>
      <div className="px-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <Image layout='fill' src={`https://imagedelivery.net/Lwkg5IUHN6-qKP-99Ln9Uw/${product.image}/public`} className="object-cover" />
          </div>
          <div className="flex items-center space-x-3 py-4 border-t border-b cursor-pointer">
            <Image width={48} height={48} src={`https://imagedelivery.net/Lwkg5IUHN6-qKP-99Ln9Uw/${product.user?.avatar}/avatar`} className="h-12 w-12 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm text-medium text-gray-700">{product.user?.name}</p>
              <Link href={`/users/profiles/${product.user?.id}`}>
                <a className="text-xs text-medium text-gray-500">View profile &rarr;</a>
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <span className="block mt-2 text-2xl font-medium text-gray-900">{`${product.price}원`}</span>
            <p className="text-base my-6 text-gray-700">{product.description}</p>
            <div className="flex justify-between items-center space-x-3">
              <Button text="Talk to seller" />
              <button onClick={onFavClick}
                className={jcn("p-2 flex items-center justify-center text-gray-500", isFav ? "text-red-600" : "")}>
                {isFav ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-700">Similar items</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {relatedProducts.map((item) => (
              <Link key={item?.id} href={`/items/${item?.id}`}>
                <div key={item?.id}>
                  <div className="h-56 w-full mb-2 bg-gray-200" />
                  <h3 className="text-sm text-gray-700 -mb-1">{item?.name}</h3>
                  <span className="text-sm font-medium text-gray-900">{item?.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {}
    }
  }
  const product = await client.product.findUnique({
    where: { id: +ctx.params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  })
  const terms = product?.name.split(" ").map(word => ({
    name: {
      contains: word
    }
  }))
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: { id: { not: product?.id } }
    }
  })
  const isFav = false
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isFav
    }
  }
}

export default ItemDetail;