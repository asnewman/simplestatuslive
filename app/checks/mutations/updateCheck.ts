import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateCheck = z.object({
  id: z.number(),
  pass: z.boolean(),
  projectId: z.number(),
  projectDependencyId: z.number(),
  run: z.number(),
  datetime: z.date(),
})

export default resolver.pipe(
  resolver.zod(UpdateCheck),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const check = await db.check.update({ where: { id }, data })

    return check
  }
)
