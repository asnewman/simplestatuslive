import checkDependency from "app/checks/checkDependency"
import checkManagedDependencies from "app/managed-dependencies/checkManagedDependencies"
import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    void checkManagedDependencies()

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end("Success")
  } else {
    res.statusCode = 404
    return res.end()
  }
}

export default handler
