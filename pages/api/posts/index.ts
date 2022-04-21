import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../libs/server/withHandler";
import { withApiSession } from "../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const { query: { lat, lng } } = req
    const latF = parseFloat(lat.toString())
    const lngF = parseFloat(lng.toString())
    const posts = await client.post.findMany({
      where: {
        lat: { gte: latF - 0.01, lte: latF + 0.01 },
        lng: { gte: lngF - 0.01, lte: lngF + 0.01 },
      },
      include: {
        _count: {
          select: { wondering: true, answer: true }
        },
        user: { select: { id: true, name: true, avatar: true } }
      }
    })
    res.json({ok: true, posts})
  }
  if (req.method === "POST") {
    const { body: { question, lat, lng }, session: { user } } = req
    const post = await client.post.create({
      data: {
        question, lat, lng, user: { connect: { id: user?.id } }
      }
    })
    await res.unstable_revalidate("/community")
    res.json({ ok: true, post })
  }
}

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }))