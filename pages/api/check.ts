import axios, { AxiosRequestHeaders, AxiosResponse } from "axios"
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
          .get(dependency.url, {
            headers:
              Object.entries(dependency.headers || {}).length === 0
                ? undefined
                : (dependency.headers as AxiosRequestHeaders),
            data: Object.entries(dependency.data || {}).length === 0 ? undefined : dependency.data,
          })
          .then((response) => {
            if (dependency.url.includes("https://www.githubstatus.com")) {
              if (response.data.includes("All Systems Operational")) {
                saveSuccess(dependency.id, project.id)
              } else {
                saveFailure(dependency.id, project.id)
              }
            } else if (dependency.url.includes("https://status.slack.com")) {
              if (response.data.includes("Slack is up and running")) {
                saveSuccess(dependency.id, project.id)
              } else {
                saveFailure(dependency.id, project.id)
              }
            } else {
              if (response.status !== 200) {
                saveFailure(dependency.id, project.id)
              } else {
                saveSuccess(dependency.id, project.id)
              }
            }
          })
          .catch((e) => {
            console.info("Check failed: " + dependency.url + " " + e)
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
