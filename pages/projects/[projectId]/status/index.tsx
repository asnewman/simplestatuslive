import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProject from "app/projects/queries/getProject"
import getProjectDependencies from "app/project-dependencies/queries/getProjectDependencies"
import getProjectDependencyChecks from "app/checks/queries/getProjectDependencyChecks"
import Head from "next/head"
import { useMemo } from "react"
import getManagedDependenciesForProject from "app/managed-dependencies/queries/getManagedDependenciesForProject"
import { useRouter } from "next/router"

const StatusPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [project, {}] = useQuery(getProject, { id: projectId })
  const [{ projectDependencies: dependencies }, {}] = useQuery(getProjectDependencies, {
    where: { projectId },
  })
  const [checksByDependency] = useQuery(getProjectDependencyChecks, { projectId })
  const [managedDependencies] = useQuery(getManagedDependenciesForProject, project.id)
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
          <td>
            <span className="pad1charside">{dependency.name}</span>
          </td>
          <td>
            <span className="pad1charside">{checks[0]?.pass ? "🟢" : "🔴"}</span>
          </td>
          <td>
            <span className="pad1charside">
              {checks.map((check) => (
                <div key={check.id} className="hover">
                  <a href="#">{check.pass ? "🟢" : "🔴"}</a>
                  <div className="popup">{check.datetime.toString()}</div>
                </div>
              ))}
            </span>
          </td>
        </tr>
      )
    })
  }

  function renderManagedDependencies() {
    if (!managedDependencies) return <></>

    return managedDependencies.map((managedDependency) => {
      const lastCheck = managedDependency.checks[managedDependency.checks.length - 1] as any

      return (
        <tr key={managedDependency.name}>
          <td>
            <span className="pad1charside">{managedDependency.name}</span>
          </td>
          <td>
            <span className="pad1charside">{lastCheck?.passed ? "🟢" : "🔴"}</span>
          </td>
          <td>
            <span className="pad1charside">
              {managedDependency.checks.slice(-10).map((check: any) => (
                <div key={check.datetime} className="hover">
                  <a href="#">{check.passed ? "🟢" : "🔴"}</a>
                  <div className="popup">{new Date(check.datetime).toString()}</div>
                </div>
              ))}
            </span>
          </td>
        </tr>
      )
    })
  }

  return (
    <>
      <Head>
        <title>{project.name} status</title>
      </Head>
      <div className="container is-fullheight-100vh" style={{ position: "relative" }}>
        <h1 className="white-255-text" style={{ fontSize: 28 }}>
          {project.name}
        </h1>
        <button
          className="tui-button"
          style={{ padding: 10, position: "absolute", top: 0, right: 0 }}
          onClick={async () => {
            await router.push(`/projects/${project.id}/status/email`)
          }}
        >
          Subscribe to updates
        </button>
        {isTherePotentialIssue ? (
          <div className="tui-window red-168 full-width">
            <p className="pad1charside">
              Dependency issues detected. There may be interruptions to this service.
            </p>
          </div>
        ) : (
          <div className="tui-window green-168 full-width">
            <p className="pad1charside">All dependencies are functional.</p>
          </div>
        )}

        {project.status && (
          <div className="block">
            <strong>Status - </strong>
            {project.status}
          </div>
        )}
        <br />
        <br />
        <table className="tui-table full-width">
          <thead>
            <tr>
              <th>Dependency</th>
              <th>Status</th>
              <th>History</th>
            </tr>
          </thead>
          <tbody>
            {renderDependencies()}
            {renderManagedDependencies()}
          </tbody>
        </table>
      </div>
      <footer className="my-footer">
        <div className="content has-text-centered">
          <p>
            👀 Monitored by <a>simplestat.us</a>
          </p>
        </div>
      </footer>
    </>
  )
}

export default StatusPage
