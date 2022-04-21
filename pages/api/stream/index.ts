import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/server/prismaClient"
import withHandler, { ResponseType } from "../../../libs/server/withHandler";
import { withApiSession } from "../../../libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const streams = await client.stream.findMany({})
    res.json({ ok: true, streams })
  }
  if (req.method === "POST") {
    const { body: { name, price, description }, session: { user } } = req
    const { uid, rtmps: { url, streamKey } } = await (
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CFS_TOKEN}`
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`
        }
      )
    ).json()
    console.log(uid, url)
    const stream = await client.stream.create({
      data: {
        name, price, description, user: { connect: { id: user?.id } }, liveId: uid, liveUrl: url, liveKey: streamKey
      }
    })

    res.json({ ok: true, stream })
  }
}

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }))