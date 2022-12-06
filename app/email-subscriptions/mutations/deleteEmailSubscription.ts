import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteEmailSubscription = z.object({
  id: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteEmailSubscription), async ({ id, projectId }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const emailSubscription = await db.emailSubscription.deleteMany({
    where: { id, projectId },
  })

  return emailSubscription
})
