import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../../libs/server/withHandler";
import { withApiSession } from "../../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { body, query: { id }, session: { user } } = req
  const message = await client.message.create({
    data: { message: body.message, user: { connect: { id: user?.id } }, stream: { connect: { id: +id } } }
  })
  res.json({ ok: true, message })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))