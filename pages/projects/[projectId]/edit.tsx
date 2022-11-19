import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import updateProject from "app/projects/mutations/updateProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { z } from "zod"
import getProjectDependencies from "app/project-dependencies/queries/getProjectDependencies"
import createProjectDependency from "app/project-dependencies/mutations/createProjectDependency"
import deleteProjectDependency from "app/project-dependencies/mutations/deleteProjectDependency"

export const EditProject = () => {
  const projectId = useParam("projectId", "number")
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
  const [updateProjectMutation] = useMutation(updateProject)
  const [createProjectDependencyMutation] = useMutation(createProjectDependency)
  const [deleteProjectDependencyMutation] = useMutation(deleteProjectDependency)

  const [projName, setProjName] = useState(project.name)
  const [projEmail, setProjEmail] = useState(project.email)
  const [projSlackhook, setProjSlackhook] = useState(project.slackWebhook)

  const [addProjectName, setAddProjectName] = useState("")
  const [addProjectUrl, setAddProjectUrl] = useState("")
  const [addProjectHeaders, setAddProjectHeaders] = useState("{}")
  const [addProjectData, setAddProjectData] = useState("{}")

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

  return (
    <>
      <Head>
        <title>Edit Project {project.id}</title>
      </Head>
      <div className="tui-panel green-168 black-255-text full-width">simplestatus</div>
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
        <div className="tui-window full-width">
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
        <div className="tui-window full-width">
          <fieldset className="tui-fieldset">
            <legend className="tui-legend">add new dependency</legend>
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
        <h2 className="green-168-text">project dependencies</h2>
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
                <td>{pj.name}</td>
                <td>{pj.url}</td>
                <td>
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
