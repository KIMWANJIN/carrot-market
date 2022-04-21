import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../../libs/server/withHandler";
import { withApiSession } from "../../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: { id }, session: { user } } = req

  // find product which is not only same with product id but also same with assigned userId
  const favoredProduct = await client.favorite.findFirst({
    where: {
      productId: +id,
      userId: user?.id
    }
  })

  if (favoredProduct) {
    await client.favorite.delete({
      where: { id: favoredProduct.id }
    })
  } else {
    await client.favorite.create({
      data: { user: { connect: { id: user?.id } }, product: { connect: { id: +id } } }
    })
  }
  res.json({ ok: true })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))