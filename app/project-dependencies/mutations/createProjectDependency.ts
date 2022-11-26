import { resolver } from "@blitzjs/rpc"
import checkDependency from "app/checks/checkDependency"
import db from "db"
import { z } from "zod"

const CreateProjectDependency = z.object({
  name: z.string(),
  url: z.string().trim().url(),
  projectId: z.number(),
  headers: z.record(z.string(), z.any()),
  data: z.record(z.string(), z.any()),
})

export default resolver.pipe(
  resolver.zod(CreateProjectDependency),
  resolver.authorize(),
  async (input, ctx) => {
    const project = await db.project.findFirst({ where: { id: input.projectId } })

    if (!project) {
      throw new Error("Project not found")
    }

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectDependency = await db.projectDependency.create({
      data: { ...input, userId: ctx.session.userId },
    })

    checkDependency(project, projectDependency).catch((e) => {
      console.error(
        `Failed projectId ${project.id} to check dependency ${projectDependency.id}: ` + e
      )
    })

    return projectDependency
  }
)
