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
import Script from "next/script"
import createProjectDependency from "app/project-dependencies/mutations/createProjectDependency"

export const EditProject = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(
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
  const [createProjectDependencyMutation] = useMutation(createProjectDependency)

  const [addProjectName, setAddProjectName] = useState("")
  const [addProjectUrl, setAddProjectUrl] = useState("")
  const [addProjectHeaders, setAddProjectHeaders] = useState("{}")
  const [addProjectData, setAddProjectData] = useState("{}")

  async function addProject() {
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
  }

  return (
    <>
      <Head>
        <title>Edit Project {project.id}</title>
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/tuicss@2.0.1/dist/tuicss.min.js"></Script>
      <div className="tui-panel green-168 black-255-text full-width">simplestatus</div>
      <div className="pad1charside">
        <h1 className="green-168-text">{project.name}</h1>
        <div className="tui-window full-width">
          <fieldset className="tui-fieldset">
            <legend className="tui-legend">project details</legend>
            <div>
              name...: <input className="tui-input" type="text" value={project.name} />
            </div>
            <div>
              email...: <input className="tui-input" type="text" value={project.email} />
            </div>
            <div>
              slack hook...:{" "}
              <input className="tui-input" type="text" value={project.slackWebhook} />
            </div>
            <br />
            <button className="tui-button">save</button>
          </fieldset>
        </div>
        <br />
        <br />
        <div className="tui-window full-width">
          <fieldset className="tui-fieldset">
            <legend className="tui-legend">add new dependency</legend>
            <div>
              name...:{" "}
              <input
                className="tui-input"
                type="text"
                value={addProjectName}
                onChange={(e) => setAddProjectName(e.target.value)}
              />
            </div>
            <div>
              url...:{" "}
              <input
                className="tui-input"
                type="text"
                value={addProjectUrl}
                onChange={(e) => setAddProjectUrl(e.target.value)}
              />
            </div>
            <div>
              headers...: <br />
              <textarea
                className="tui-textarea full-width"
                rows={4}
                value={addProjectHeaders}
                onChange={(e) => setAddProjectHeaders(e.target.value)}
              ></textarea>
            </div>
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
            <button className="tui-button" onClick={addProject}>
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
                <td className="red-255-text">x</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <br />
        <br />
      </div>
      <DeleteModal />
      <button className="tui-button tui-modal-button" data-modal="modal">
        ◄ Click ►
      </button>
      <div className="tui-overlap"></div>
    </>
  )
}

function DeleteModal() {
  return (
    <div id="modal" className="tui-modal">
      <div className="tui-window red-168">
        <fieldset className="tui-fieldset">
          <legend className="red-255 yellow-255-text">Alert</legend>
          <button className="tui-button tui-modal-close-button left" data-modal="modal">
            delete
          </button>
          <button className="tui-button tui-modal-close-button right" data-modal="modal">
            cancel
          </button>
        </fieldset>
      </div>
    </div>
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
