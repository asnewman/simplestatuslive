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
  async (input) => {
    await db.managedDependenciesOnProjects.deleteMany({
      where: {
        projectId: input.projectId,
        managedDependencyId: input.managedDependencyId,
      },
    })
  }
)
