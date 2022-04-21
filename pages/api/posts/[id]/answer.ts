import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../../libs/server/withHandler";
import { withApiSession } from "../../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: { id }, body: { answer }, session: { user } } = req

  const postAnswer = await client.answer.create({
    data: { answer, user: { connect: { id: user?.id } }, post: { connect: { id: +id } } }
  })

  res.json({ ok: true, answer: postAnswer })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))