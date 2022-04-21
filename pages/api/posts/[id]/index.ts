import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../../libs/server/withHandler";
import { withApiSession } from "../../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: { id }, session: { user } } = req
  const post = await client.post.findUnique({
    where: { id: +id },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      _count: { select: { answer: true, wondering: true } },
      answer: { select: { answer: true, id: true, updatedAt: true, user: { select: { id: true, name: true, avatar: true } } } }
    }
  })
  const isWondering = Boolean(await client.wondering.findFirst({
    where: { postId: +id, userId: user?.id }, select: { id: true }
  }))
  res.json({ ok: true, post, isWondering })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))