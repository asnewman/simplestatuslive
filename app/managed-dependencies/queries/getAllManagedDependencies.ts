import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const result = await db.managedDependency.findMany({})
  return result
})
