import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../libs/server/withHandler";
import { withApiSession } from "../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { session: { user } } = req
  const recevedReviews = await client.review.findMany({
    where: { receiverId: user?.id },
    include: {
      writer: { select: { id: true, name: true, avatar: true } }
    }
  })

  res.json({ ok: true, recevedReviews })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))