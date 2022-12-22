import { Suspense, useState, useEffect } from "react"
import Head from "next/head"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam, useRouterQuery } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getProjectSecure from "app/projects/queries/getProjectSecure"
import updateProject from "app/projects/mutations/updateProject"
import updateSlackWebhook from "app/projects/mutations/updateSlackWebhook"
import getProjectDependencies from "app/project-dependencies/queries/getProjectDependencies"
import createProjectDependency from "app/project-dependencies/mutations/createProjectDependency"
import deleteProjectDependency from "app/project-dependencies/mutations/deleteProjectDependency"
import getManagedDependenciesForProject from "app/managed-dependencies/queries/getManagedDependenciesForProject"
import attachManagedDependencyToProject from "app/managed-dependencies/mutations/attachManagedDependencyToProject"
import getAllManagedDependencies from "app/managed-dependencies/queries/getAllManagedDependencies"
import detachManagedDependencyToProject from "app/managed-dependencies/mutations/detachManagedDependencyToProject"
import TopBanner from "app/core/components/TopBanner"
import Link from "next/link"

const slackClientId = '4492198045090.4506805403075'
const getSlackRedirectUrl = (projectId: number) => `https://slack.com/oauth/v2/authorize?scope=incoming-webhook&user_scope=&redirect_uri=https%3A%2F%2Fsimplestat.us%2Fprojects%2F${projectId}%2Fedit&client_id=${slackClientId}`;
const addToSlackBtn = (projectId: number) => <a href={getSlackRedirectUrl(projectId)} style={{alignItems: 'center', color: '#000', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', display: 'inline-flex', fontFamily: 'Lato, sans-serif', fontSize: '14px', fontWeight: 600, height: '44px', justifyContent: 'center', textDecoration: 'none', width: '204px'}}><svg xmlns="http://www.w3.org/2000/svg" style={{height: '16px', width: '16px', marginRight: '12px'}} viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a" /><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0" /><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d" /><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e" /></svg>Add to Slack</a>

export const EditProject = () => {
  const projectId = useParam("projectId", "number") || -1
  const query = useRouterQuery();

  const [project, { refetch: refetchProject }] = useQuery(
    getProjectSecure,
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
  const [updateSlackWebhookMutation] = useMutation(updateSlackWebhook)
  const [createProjectDependencyMutation] = useMutation(createProjectDependency)
  const [deleteProjectDependencyMutation] = useMutation(deleteProjectDependency)
  const [attachManagedDependencyToProjectMutation] = useMutation(attachManagedDependencyToProject)
  const [detachManagedDependencyToProjectMutation] = useMutation(detachManagedDependencyToProject)

  const [projName, setProjName] = useState(project.name)
  const [projEmail, setProjEmail] = useState(project.email)
  const [projSlackhook, setProjSlackhook] = useState(project.slackWebhook)

  const [addProjectDepName, setAddProjectDepName] = useState("")
  const [addProjectDepUrl, setAddProjectDepUrl] = useState("")
  const [addProjectDepHeaders, setAddProjectDepHeaders] = useState("{}")
  const [addProjectDepData, setAddProjectDepData] = useState("{}")

  const [addManagedDepSelect, setAddManagedDepSelect] = useState("select")
  const [addManagedDepId, setAddManagedDepId] = useState(-1)

  const [banner, setBanner] = useState("")

  async function addProjectDependency() {
    if (!projectId) return

    await createProjectDependencyMutation({
      name: addProjectDepName,
      url: addProjectDepUrl,
      headers: JSON.parse(addProjectDepHeaders),
      data: JSON.parse(addProjectDepData),
      projectId,
    })

    setAddProjectDepName("")
    setAddProjectDepUrl("")
    setAddProjectDepHeaders("{}")
    setAddProjectDepData("{}")

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

  useEffect(function processSlackCode() {
    if (query.code && typeof query.code === "string") {
      void updateSlackWebhookMutation({ id: projectId, slackCode: query.code ||  "", redirectUri: `https://simplestat.us/projects/${projectId}/edit`})
    }
  }, [projectId, query.code, updateSlackWebhookMutation])

  return (
    <>
      <Head>
        <title>Edit Project {project.id}</title>
      </Head>
      <TopBanner />
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
        <Link href={`/projects/${project.id}/status`}>[view status page]</Link>
        <br />
        <br />
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
              {projSlackhook === "" ? addToSlackBtn(projectId) :
              <input
                className="tui-input"
                type="text"
                value={projSlackhook}
                onChange={(e) => setProjSlackhook(e.target.value)}
              />}
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
                value={addProjectDepName}
                onChange={(e) => setAddProjectDepName(e.target.value)}
              />
            </div>
            <br />
            <div>
              url.......:{" "}
              <input
                className="tui-input"
                type="text"
                value={addProjectDepUrl}
                onChange={(e) => setAddProjectDepUrl(e.target.value)}
              />
            </div>
            <br />
            <div>
              headers...: <br />
              <textarea
                className="tui-textarea full-width"
                rows={4}
                value={addProjectDepHeaders}
                onChange={(e) => setAddProjectDepHeaders(e.target.value)}
              ></textarea>
            </div>
            <br />
            <div>
              data...: <br />
              <textarea
                className="tui-textarea full-width"
                rows={4}
                value={addProjectDepData}
                onChange={(e) => setAddProjectDepData(e.target.value)}
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
                        if (window.confirm("Are you sure?")) {
                          await deleteProjectDependencyMutation({ id: pj.id })
                          await refetchProjectDependencies()
                          setBanner("project dependency deleted")
                        }
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
                        if (window.confirm("Are you sure?")) {
                          await detachManagedDependencyToProjectMutation({
                            projectId,
                            managedDependencyId: pmd.id,
                          })
                          await refetchProjectManagedDependencies()
                          setBanner("project dependency deleted")
                        }
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
