import axios, { AxiosResponse } from "axios"
import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const projects = await db.project.findMany()

    for (const project of projects) {
      // console.info("Checking: " + project.url)
      // axios
      //   .get(project.url)
      //   .then((response) => {
      //     if (response.status !== 200) {
      //       saveFailure(project.url, project.id)
      //     } else {
      //       saveSuccess(project.url, project.id)
      //     }
      //   })
      //   .catch(() => {
      //     saveFailure(project.url, project.id)
      //   })
    }

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end("Success")
  } else {
    res.statusCode = 404
    return res.end()
  }
}

const saveSuccess = (url: string, projectId: number) => {
  console.info("Check success: " + url)
  db.check
    .create({ data: { url, pass: true, projectId, run: 0, datetime: new Date() } })
    .catch((e) => {
      console.warn("Failed to save succes: " + url + e)
    })
}

const saveFailure = (url: string, projectId: number) => {
  console.info("Check failure: " + url)
  db.check
    .create({ data: { url, pass: false, projectId, run: 0, datetime: new Date() } })
    .catch((e) => {
      console.warn("Failed to save succes: " + url + e)
    })
}

export default handler
