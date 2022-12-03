import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteEmailSubscription = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteEmailSubscription),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const emailSubscription = await db.emailSubscription.deleteMany({
      where: { id },
    })

    return emailSubscription
  }
)
