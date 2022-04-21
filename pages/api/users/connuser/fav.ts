import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../../libs/server/withHandler";
import { withApiSession } from "../../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const fav = await client.favorite.findMany({
    where: {id: req.session.user?.id},
    include: { product: { include: { _count: { select: { fav: true} } } } }
  })
  res.json({ok: true, fav})
}

export default withApiSession(withHandler({methods: ["GET"], handler}))