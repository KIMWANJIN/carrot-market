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
  const wonderedPost = await client.wondering.findFirst({
    where: {
      postId: +id,
      userId: user?.id
    },
    select: { id: true }
  })

  if (wonderedPost) {
    await client.wondering.delete({
      where: { id: wonderedPost.id }
    })
  } else {
    await client.wondering.create({
      data: { user: { connect: { id: user?.id } }, post: { connect: { id: +id } } }
    })
  }
  res.json({ ok: true })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))