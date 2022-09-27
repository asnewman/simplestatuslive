import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetChecksInput
  extends Pick<
    Prisma.CheckFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetChecksInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: checks,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.check.count({ where }),
      query: (paginateArgs) =>
        db.check.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      checks,
      nextPage,
      hasMore,
      count,
    };
  }
);
