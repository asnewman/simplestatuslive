import checkDependency from "app/checks/checkDependency"
import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const projects = await db.project.findMany()

    for (const project of projects) {
      console.info("Checking: " + project.name)

      const dependencies = await db.projectDependency.findMany({
        where: {
          projectId: project.id,
        },
      })

      for (const dependency of dependencies) {
        checkDependency(project, dependency)
      }
    }

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end("Success")
  } else {
    res.statusCode = 404
    return res.end()
  }
}

export default handler
