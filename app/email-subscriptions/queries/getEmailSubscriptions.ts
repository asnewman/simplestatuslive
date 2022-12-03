import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetEmailSubscriptionsInput
  extends Pick<Prisma.EmailSubscriptionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetEmailSubscriptionsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: emailSubscriptions,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.emailSubscription.count({ where }),
      query: (paginateArgs) => db.emailSubscription.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      emailSubscriptions,
      nextPage,
      hasMore,
      count,
    }
  }
)
