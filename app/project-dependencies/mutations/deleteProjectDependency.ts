import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteProjectDependency = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteProjectDependency),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const projectDependency = await db.projectDependency.deleteMany({
      where: { id, userId: ctx.session.userId },
    })

    return projectDependency
  }
)
