import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

export default resolver.pipe(async (projectId: number) => {
  const managedDependenciesOnProject = await db.managedDependenciesOnProjects.findMany({
    where: { projectId },
  })
  const managedDependenciesIds = managedDependenciesOnProject.map((m) => m.managedDependencyId)
  const result = await db.managedDependency.findMany({
    where: {
      id: {
        in: managedDependenciesIds,
      },
    },
  })
  return result
})
