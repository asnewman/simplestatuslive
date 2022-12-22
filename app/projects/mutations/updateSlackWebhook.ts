import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import axios from "axios";

const UpdateProject = z.object({
  id: z.number(),
  slackCode: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateProject),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    if (!data.slackCode) {
      await db.project.updateMany({ where: { id, userId: ctx.session.userId }, data: {
        slackWebhook: ""
      } })
      return
    }

    const slackResponse = await axios.post("https://slack.com/api/oauth.v2.access", {
      client_id: "4492198045090.4506805403075",
      client_secret: process.env.SLACK_SECRET,
      code: data.slackCode,
      authorization_code: "incoming-webhook",
      redirect_uri: "https://simplestat.us"
    })

    console.log(slackResponse)

    await db.project.updateMany({ where: { id, userId: ctx.session.userId }, data: {
      slackWebhook: slackResponse["incoming_webhook"].url
    } })
  }
)
