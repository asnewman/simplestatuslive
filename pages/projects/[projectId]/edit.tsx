import { Suspense, useState } from "react"
import Head from "next/head"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import updateProject from "app/projects/mutations/updateProject"
import getProjectDependencies from "app/project-dependencies/queries/getProjectDependencies"
import createProjectDependency from "app/project-dependencies/mutations/createProjectDependency"
import deleteProjectDependency from "app/project-dependencies/mutations/deleteProjectDependency"
import getManagedDependenciesForProject from "app/managed-dependencies/queries/getManagedDependenciesForProject"
import attachManagedDependencyToProject from "app/managed-dependencies/mutations/attachManagedDependencyToProject"
import getAllManagedDependencies from "app/managed-dependencies/queries/getAllManagedDependencies"
import detachManagedDependencyToProject from "app/managed-dependencies/mutations/detachManagedDependencyToProject"

export const EditProject = () => {
  const projectId = useParam("projectId", "number") || -1

  const [project, { refetch: refetchProject }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [{ projectDependencies }, { refetch: refetchProjectDependencies }] = useQuery(
    getProjectDependencies,
    {
      where: { projectId },
    }
  )
  const [projectManagedDependencies, { refetch: refetchProjectManagedDependencies }] = useQuery(
    getManagedDependenciesForProject,
    projectId
  )
  const [allManagedDependencies] = useQuery(getAllManagedDependencies, {})
  const [updateProjectMutation] = useMutation(updateProject)
  const [createProjectDependencyMutation] = useMutation(createProjectDependency)
  const [deleteProjectDependencyMutation] = useMutation(deleteProjectDependency)
  const [attachManagedDependencyToProjectMutation] = useMutation(attachManagedDependencyToProject)
  const [detachManagedDependencyToProjectMutation] = useMutation(detachManagedDependencyToProject)

  const [projName, setProjName] = useState(project.name)
  const [projEmail, setProjEmail] = useState(project.email)
  const [projSlackhook, setProjSlackhook] = useState(project.slackWebhook)

  const [addProjectName, setAddProjectName] = useState("")
  const [addProjectUrl, setAddProjectUrl] = useState("")
  const [addProjectHeaders, setAddProjectHeaders] = useState("{}")
  const [addProjectData, setAddProjectData] = useState("{}")

  const [addManagedDepSelect, setAddManagedDepSelect] = useState("select")
  const [addManagedDepId, setAddManagedDepId] = useState(-1)

  const [banner, setBanner] = useState("")

  async function addProjectDependency() {
    if (!projectId) return

    await createProjectDependencyMutation({
      name: addProjectName,
      url: addProjectUrl,
      headers: JSON.parse(addProjectHeaders),
      data: JSON.parse(addProjectData),
      projectId,
    })

    setAddProjectName("")
    setAddProjectUrl("")
    setAddProjectHeaders("{}")
    setAddProjectData("{}")

    await refetchProjectDependencies()
    setBanner("project dependency added")
  }

  async function addManagedDep() {
    if (!projectId) return

    await attachManagedDependencyToProjectMutation({
      managedDependencyId: addManagedDepId,
      projectId,
    })

    await refetchProjectManagedDependencies()
    setBanner("managed dependency added")
  }

  return (
    <>
      <Head>
        <title>Edit Project {project.id}</title>
      </Head>
      <div
        className="tui-panel green-168 black-255-text full-width pad1charside"
        style={{ paddingTop: 3, paddingBottom: 3 }}
      >
        simplestatus
      </div>
      {banner && (
        <div
          className="tui-panel white-168 white-255-text"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
          }}
        >
          {banner}
        </div>
      )}
      <div className="pad1charside">
        <h1 className="green-168-text">{project.name}</h1>
        <div className="tui-window full-width black-255">
          <fieldset className="tui-fieldset">
            <legend className="tui-legend">project details</legend>
            <div>
              name.........:{" "}
              <input
                className="tui-input"
                type="text"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
              />
            </div>
            <br />
            <div>
              email........:{" "}
              <input
                className="tui-input"
                type="text"
                value={projEmail}
                onChange={(e) => setProjEmail(e.target.value)}
              />
            </div>
            <br />
            <div>
              slack hook...:{" "}
              <input
                className="tui-input"
                type="text"
                value={projSlackhook}
                onChange={(e) => setProjSlackhook(e.target.value)}
              />
            </div>
            <br />
            <button
              className="tui-button"
              onClick={async () => {
                if (!projectId) return
                await updateProjectMutation({
                  id: projectId,
                  name: projName,
                  email: projEmail,
                  slackWebhook: projSlackhook,
                })
                await refetchProject()
                setBanner("project details updated")
              }}
            >
              save
            </button>
          </fieldset>
        </div>
        <br />
        <br />
        <h2 className="green-168-text">project dependencies</h2>
        <div className="tui-window full-width black-255 black-255">
          <fieldset className="tui-fieldset">
            <legend className="tui-legend">add new project dependency</legend>
            <div>
              name......:{" "}
              <input
                className="tui-input"
                type="text"
                value={addProjectName}
                onChange={(e) => setAddProjectName(e.target.value)}
              />
            </div>
            <br />
            <div>
              url.......:{" "}
              <input
                className="tui-input"
                type="text"
                value={addProjectUrl}
                onChange={(e) => setAddProjectUrl(e.target.value)}
              />
            </div>
            <br />
            <div>
              headers...: <br />
              <textarea
                className="tui-textarea full-width"
                rows={4}
                value={addProjectHeaders}
                onChange={(e) => setAddProjectHeaders(e.target.value)}
              ></textarea>
            </div>
            <br />
            <div>
              data...: <br />
              <textarea
                className="tui-textarea full-width"
                rows={4}
                value={addProjectData}
                onChange={(e) => setAddProjectData(e.target.value)}
              ></textarea>
            </div>
            <br />
            <button className="tui-button" onClick={addProjectDependency}>
              add
            </button>
          </fieldset>
        </div>
        <br />
        <br />
        <table className="tui-table full-width">
          <thead>
            <tr>
              <th>name</th>
              <th>url</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {projectDependencies.map((pj) => (
              <tr key={pj.id}>
                <td>
                  <span className="pad1charside">{pj.name}</span>
                </td>
                <td>
                  <span className="pad1charside">{pj.url}</span>
                </td>
                <td>
                  <span className="pad1charside">
                    <button
                      className="tui-button tui-modal-button red-255"
                      onClick={async () => {
                        await deleteProjectDependencyMutation({ id: pj.id })
                        await refetchProjectDependencies()
                        setBanner("project dependency deleted")
                      }}
                    >
                      delete
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <h2 className="green-168-text">managed dependencies</h2>
        <div className="tui-window full-width black-255">
          <fieldset className="tui-fieldset">
            <legend className="tui-legend">add new managed dependency</legend>
            <div>
              managed dependency.......:{" "}
              <li className="tui-dropdown">
                <button className="tui-button">{addManagedDepSelect}</button>
                <div className="tui-dropdown-content">
                  <ul>
                    {allManagedDependencies.map((md) => (
                      <li
                        key={md.id}
                        onClick={() => {
                          setAddManagedDepSelect(md.name)
                          setAddManagedDepId(md.id)
                        }}
                      >
                        <a href="#!">{md.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </div>
            <br />
            <button className="tui-button" onClick={() => addManagedDep()}>
              add
            </button>
          </fieldset>
        </div>
        <br />
        <br />
        <table className="tui-table full-width">
          <thead>
            <tr>
              <th>name</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {projectManagedDependencies.map((pmd) => (
              <tr key={pmd.id}>
                <td>
                  <span className="pad1charside">{pmd.name}</span>
                </td>
                <td>
                  <span className="pad1charside">
                    <button
                      className="tui-button tui-modal-button red-255"
                      onClick={async () => {
                        await detachManagedDependencyToProjectMutation({
                          projectId,
                          managedDependencyId: pmd.id,
                        })
                        await refetchProjectManagedDependencies()
                        setBanner("project dependency deleted")
                      }}
                    >
                      delete
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <br />
        <br />
      </div>
    </>
  )
}

const EditProjectPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProject />
      </Suspense>
    </div>
  )
}

EditProjectPage.authenticate = true
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProjectPage
