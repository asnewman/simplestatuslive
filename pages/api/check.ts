import axios, { AxiosResponse } from "axios"
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
        axios
          .get(dependency.url)
          .then((response) => {
            if (response.status !== 200) {
              saveFailure(dependency.id, project.id)
            } else {
              saveSuccess(dependency.id, project.id)
            }
          })
          .catch(() => {
            saveFailure(dependency.id, project.id)
          })
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

const saveSuccess = (dependencyId: number, projectId: number) => {
  console.info("Check success dependencyId: " + dependencyId)
  db.check
    .create({
      data: {
        pass: true,
        projectId,
        projectDependencyId: dependencyId,
        run: 0,
        datetime: new Date(),
      },
    })
    .catch((e) => {
      console.warn("Failed to save success dependencyId: " + dependencyId + e)
    })
}

const saveFailure = (dependencyId: number, projectId: number) => {
  console.info("Check failure dependencyId: " + dependencyId)
  db.check
    .create({
      data: {
        pass: false,
        projectId,
        projectDependencyId: dependencyId,
        run: 0,
        datetime: new Date(),
      },
    })
    .catch((e) => {
      console.warn("Failed to save failure dependencyId: " + dependencyId + e)
    })
}

export default handler
