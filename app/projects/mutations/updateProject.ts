import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateProject = z.object({
  id: z.number(),
  status: z.string().nullable().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  slackWebhook: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateProject),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const project = await db.project.updateMany({ where: { id, userId: ctx.session.userId }, data })

    return project
  }
)
