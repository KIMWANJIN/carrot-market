import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../../libs/server/withHandler";
import { withApiSession } from "../../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: { id }, session: { user } } = req
  let stream = await client.stream.findUnique({
    where: { id: +id },
    include: {
      // user: { select: { id: true, name: true, avatar: true } },
      message: { select: { id:true, message: true, user: { select: { id: true, avatar: true } } } }
    }
  })
  const isOwner = stream?.userId === user?.id
  if (stream && !isOwner) {
    stream.liveKey = ""
    stream.liveUrl = ""
  } 
  res.json({ ok: true, stream })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))