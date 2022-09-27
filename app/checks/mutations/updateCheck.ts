import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateCheck = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateCheck),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const check = await db.check.update({ where: { id }, data });

    return check;
  }
);
