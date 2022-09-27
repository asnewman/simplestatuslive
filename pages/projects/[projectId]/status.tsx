import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import Head from "next/head"
import { Suspense } from "react"

const StatusPage = () => {
  const projectId = useParam("projectId", "number")
  const [project, {}] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  return (
    <>
      <Head>
        <title>{project.name} status</title>
      </Head>
      <div className="container is-fullheight-100vh is-max-desktop px-5">
        <h1 className="title is-1 mt-4">{project.name}</h1>
        <div className="notification is-warning">Dependency issues detected</div>
        <div className="block">
          <strong>Update 7/20 6:43PM - </strong>API is down due to a bad release. We are working on
          a fix.
        </div>
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Dependency</th>
              <th>Status</th>
              <th>History</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Web Page</td>
              <td>🟢</td>
              <td>🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢</td>
            </tr>
            <tr>
              <td>API</td>
              <td>🔴</td>
              <td>🔴🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢</td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer className="my-footer">
        <div className="content has-text-centered">
          <p>
            👀 Monitored by <a>simplestatus.live</a>
          </p>
        </div>
      </footer>
    </>
  )
}

StatusPage.authenticate = false
StatusPage.getLayout = (page) => <Layout>{page}</Layout>

export default StatusPage
