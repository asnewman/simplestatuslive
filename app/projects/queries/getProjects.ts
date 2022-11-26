import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const userId = ctx.session.userId
  return await db.project.findMany({ where: { userId } })
})
