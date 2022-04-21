import useSWR from "swr";
import { ProductWithCount } from "../pages";
import Item from "./Items"

interface ProductListKind {
  kind: "fav" | "sale" | "purchase"
}

interface ProductListItem {
  id: number
  product: ProductWithCount
}

interface ProductListRes {
  [key: string]: ProductListItem[]
}

export default function ProductsList({ kind }: ProductListKind) {
  const { data } = useSWR<ProductListRes>(`/api/users/connuser/${kind}`)
  console.log(data)
  return data ? (
    <>
      {data[kind]?.map((item) => (
        <Item
          id={item.product.id}
          key={item.id}
          title={item.product.name}
          price={item.product.price}
          hearts={item.product._count.fav}
          comments={0}
        />
      ))}
    </>
  ) : null
}