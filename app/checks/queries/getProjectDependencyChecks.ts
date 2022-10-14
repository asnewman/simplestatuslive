import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Check, Prisma } from "db"
import { z } from "zod"

const GetProjectDependencyChecks = z.object({
  projectId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProjectDependencyChecks),
  // resolver.authorize(),
  async ({ projectId }) => {
    const checksByDependency: Record<number, Check[]> = {}
    const depedencies = await db.projectDependency.findMany({})

    for (const dependency of depedencies) {
      checksByDependency[dependency.id] = await db.check.findMany({
        where: { projectDependencyId: dependency.id },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      })
    }

    return checksByDependency
  }
)
