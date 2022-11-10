import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteManagedDependency = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteManagedDependency),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const managedDependency = await db.managedDependency.deleteMany({
      where: { id },
    })

    return managedDependency
  }
)
