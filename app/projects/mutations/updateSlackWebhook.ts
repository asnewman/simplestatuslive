import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import axios from "axios";

const UpdateProject = z.object({
  id: z.number(),
  slackCode: z.string().optional(),
  redirectUri: z.string(),
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

    const slackResponse = await axios.post(`https://slack.com/api/oauth.v2.access?client_id=4492198045090.4506805403075&client_secret=${process.env.SLACK_SECRET}&code=${data.slackCode}&redirect_uri=${data.redirectUri}`)

    console.log(slackResponse)

    await db.project.updateMany({ where: { id, userId: ctx.session.userId }, data: {
      slackWebhook: slackResponse.data["incoming_webhook"].url
    } })
  }
)
