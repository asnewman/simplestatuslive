import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateManagedDependency = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateManagedDependency),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const managedDependency = await db.managedDependency.update({
      where: { id },
      data,
    })

    return managedDependency
  }
)
