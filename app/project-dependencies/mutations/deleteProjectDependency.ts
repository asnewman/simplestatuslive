import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteProjectDependency = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteProjectDependency),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectDependency = await db.projectDependency.deleteMany({
      where: { id },
    });

    return projectDependency;
  }
);
