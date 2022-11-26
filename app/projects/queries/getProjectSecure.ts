import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.authorize(),
  resolver.zod(GetProject),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.findFirst({ where: { id, userId: ctx.session.userId } })

    if (!project) throw new NotFoundError()

    return project
  }
)
