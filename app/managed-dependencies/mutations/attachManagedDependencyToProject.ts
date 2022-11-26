import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const AttachManagedDependencyToProject = z.object({
  projectId: z.number(),
  managedDependencyId: z.number(),
})

export default resolver.pipe(
  resolver.zod(AttachManagedDependencyToProject),
  resolver.authorize(),
  async (input, ctx) => {
    const project = await db.project.findFirst({
      where: { id: input.projectId, userId: ctx.session.userId },
    })

    if (!project) {
      throw new Error("you don't have permission to do this")
    }

    await db.managedDependenciesOnProjects.create({
      data: {
        projectId: input.projectId,
        managedDependencyId: input.managedDependencyId,
      },
    })
  }
)
