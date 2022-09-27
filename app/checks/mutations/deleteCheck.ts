import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteCheck = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteCheck),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const check = await db.check.deleteMany({ where: { id } });

    return check;
  }
);
