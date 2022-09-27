import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateProjectDependency = z.object({
  id: z.number(),
  url: z.string().trim().url(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateProjectDependency),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectDependency = await db.projectDependency.update({
      where: { id },
      data,
    })

    return projectDependency
  }
)
