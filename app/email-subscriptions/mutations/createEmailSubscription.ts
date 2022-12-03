import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateEmailSubscription = z.object({
  email: z.string().email(),
  projectId: z.number(),
})

export default resolver.pipe(resolver.zod(CreateEmailSubscription), async (input) => {
  const exist = await db.emailSubscription.findMany({
    where: { email: input.email, projectId: input.projectId },
  })

  if (exist.length > 0) {
    throw new Error("Email already subscribed")
  }

  const emailSubscription = await db.emailSubscription.create({
    data: input,
  })

  return emailSubscription
})
