import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateProjectDependency = z.object({
  name: z.string(),
  url: z.string().trim().url(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateProjectDependency),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectDependency = await db.projectDependency.create({
      data: input,
    })

    return projectDependency
  }
)
