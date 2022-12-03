import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateEmailSubscription = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateEmailSubscription),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const emailSubscription = await db.emailSubscription.update({
      where: { id },
      data,
    })

    return emailSubscription
  }
)