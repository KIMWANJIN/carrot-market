import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/server/prismaClient"
import withHandler, {ResponseType} from "../../../libs/server/withHandler";
import twilio from "twilio";
import sgmail from "@sendgrid/mail" 

// This handler function handle View
// In next js the function naver be called(or returned) if do not export default
// When the user call url of the function which is exported default, 
// Next JS will excute the function and give its parameters(at this fun : req, res) to the function

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
sgmail.setApiKey(process.env.SG_API_KEY!)

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body
    const loginInput = phone ? { phone } : email ? { email } : null
    if (!loginInput) return res.status(400).json({ok:false})
    const payload = String(Math.floor(100000 + Math.random() * 900000))
    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...loginInput
                    },
                    create: {
                        name: "Anonymous",
                        ...loginInput
                    }
                }
            }
        }
    })
    if (phone) {
        // await twilioClient.messages.create({
        //     messagingServiceSid: process.env.TWILIO_CM_SID,
        //     to: process.env.PHONE!,
        //     body: `일회용 비밀번호 : ${payload}`
        // })
    } else if (email) {
/*         await sgmail.send({
            from: "opener.world.com@gmail.com",
            to: "opener.world.com@gmail.com",
            subject: "Carrot Market 로그인",
            text: `Carrot Market 로그인 일회용 비밀번호 : ${payload}`,
            html: `<strong>Carrot Market 로그인 일회용 비밀번호 : ${payload}</strong>`
        }) */
    }
    return res.json({ok:true})
}

export default withHandler({methods: ["POST"], handler, privMode: false})