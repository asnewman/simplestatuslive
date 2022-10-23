import { Ctx } from "@blitzjs/next"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateProject = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateProject),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    if (!ctx.session.userId) {
      throw new Error("No user")
    }

    const project = await db.project.create({ data: { userId: ctx.session.userId, ...input } })

    return project
  }
)
