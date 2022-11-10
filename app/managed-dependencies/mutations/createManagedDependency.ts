import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateManagedDependency = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateManagedDependency),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const managedDependency = await db.managedDependency.create({
      data: input,
    })

    return managedDependency
  }
)
