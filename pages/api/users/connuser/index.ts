import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../../libs/server/withHandler";
import { withApiSession } from "../../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id }
    })
    res.json({ ok: true, profile })
  }
  if (req.method === "POST") {
    const { body: { name, email, phone, avatar }, session: { user } } = req
    const currentUser = await client.user.findUnique({
      where: { id: user?.id }
    })
    if (name && name !== currentUser?.name) {
      await client.user.update({
        where: { id: user?.id },
        data: { name }
      })
      res.json({ ok: true })
    }
    if (email && email !== currentUser?.email) {
      const preEmail = Boolean(await client.user.findUnique({
        where: {
          email
        }, select: { id: true }
      }))
      if (preEmail) {
        return res.json({ ok: false, dupError: "Email already taken." })
      }
      await client.user.update({
        where: { id: user?.id },
        data: { email }
      })
      res.json({ ok: true })
    }
    if (phone && phone !== currentUser?.phone) {
      const prePhone = Boolean(await client.user.findUnique({
        where: {
          phone
        }, select: { id: true }
      }))
      if (prePhone) {
        return res.json({ ok: false, dupError: "Phone already taken." })
      }
      await client.user.update({
        where: { id: user?.id },
        data: { phone }
      })
      res.json({ ok: true })
    }
    if (avatar) {
      await client.user.update({
        where: { id: user?.id },
        data: { avatar }
      })
      res.json({ ok: true })
    }
    res.json({ ok: true })
  }
}

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }))