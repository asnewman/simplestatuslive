import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateCheck = z.object({
  pass: z.boolean(),
  projectId: z.number(),
  projectDependencyId: z.number(),
  run: z.number(),
  datetime: z.date(),
})

export default resolver.pipe(resolver.zod(CreateCheck), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const check = await db.check.create({ data: input })

  return check
})
