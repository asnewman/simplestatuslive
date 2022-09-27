import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetProjectDependenciesInput
  extends Pick<
    Prisma.ProjectDependencyFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({
    where,
    orderBy,
    skip = 0,
    take = 100,
  }: GetProjectDependenciesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: projectDependencies,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.projectDependency.count({ where }),
      query: (paginateArgs) =>
        db.projectDependency.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      projectDependencies,
      nextPage,
      hasMore,
      count,
    };
  }
);
