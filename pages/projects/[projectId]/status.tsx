import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import getProjectDependencies from "app/project-dependencies/queries/getProjectDependencies"
import getProjectDependencyChecks from "app/checks/queries/getProjectDependencyChecks"
import Head from "next/head"
import { useMemo } from "react"

const StatusPage = () => {
  const projectId = useParam("projectId", "number")
  const [project, {}] = useQuery(getProject, { id: projectId })
  const [{ projectDependencies: dependencies }, {}] = useQuery(getProjectDependencies, {
    where: { projectId },
  })
  const [checksByDependency] = useQuery(getProjectDependencyChecks, { projectId })

  const dependencyMap = useMemo(() => {
    return dependencies.reduce((obj, dependency) => ({ ...obj, [dependency.id]: dependency }), {})
  }, [dependencies])

  const isTherePotentialIssue = useMemo(() => {
    if (!checksByDependency) return false

    return Object.values(checksByDependency).some((checks) => {
      if (!checks[0]) return true
      return !checks[0].pass
    })
  }, [checksByDependency])

  function renderDependencies() {
    if (!checksByDependency || !dependencyMap) return <></>

    return Object.entries(checksByDependency).map(([dependencyId, checks]) => {
      const dependency = dependencyMap[dependencyId]
      if (!dependency) return <></>
      return (
        <tr key={dependency.name}>
          <td>{dependency.name}</td>
          <td>{checks[0]?.pass ? "🟢" : "🔴"}</td>
          <td>{checks.map((check) => (check.pass ? "🟢" : "🔴"))}</td>
        </tr>
      )
    })
  }

  return (
    <>
      <Head>
        <title>{project.name} status</title>
      </Head>
      <div className="container is-fullheight-100vh is-max-desktop px-5">
        <h1 className="title is-1 mt-4">{project.name}</h1>
        {isTherePotentialIssue ? (
          <div className="notification is-warning">
            Dependency issues detected. There may be interruptions in this service.
          </div>
        ) : (
          <div className="notification is-success">All dependencies are functional.</div>
        )}
        {project.status && (
          <div className="block">
            <strong>Status - </strong>
            {project.status}
          </div>
        )}
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Dependency</th>
              <th>Status</th>
              <th>History</th>
            </tr>
          </thead>
          <tbody>{renderDependencies()}</tbody>
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
