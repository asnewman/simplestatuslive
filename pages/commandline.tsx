import { useMutation } from "@blitzjs/rpc"
import attachManagedDependencyToProject from "app/managed-dependencies/mutations/attachManagedDependencyToProject"
import createProjectDependency from "app/project-dependencies/mutations/createProjectDependency"
import createProject from "app/projects/mutations/createProject"
import updateProject from "app/projects/mutations/updateProject"
import { ReactTerminal } from "react-terminal"

function Commandline(props) {
  const [createProjectMutation] = useMutation(createProject)
  const [updateProjectMutation] = useMutation(updateProject)
  const [createProjectDependencyMutation] = useMutation(createProjectDependency)
  const [attachManagedDependencyToProjectMutation] = useMutation(attachManagedDependencyToProject)
  // Define commands here
  const commands = {
    help: () => {
      return (
        <span>
          Available commands:
          <br />
          <br />
          create-project [name]
          <br />
          <br />
          attach-dependency [projectId] [dependencyName] [url] [header] [headers] [data]
          <br />
          example: attach-dependency 1 Google https://google.com {"{}"} {"{}"}
          <br />
          header and data must be in JSON format
          <br />
          <br />
          attach-managed-dependency [projectId] [managedDependecyId]
          <br />
          <br />
          set-project-status [projectId] [status]
          <br />
          <br />
          clear-project-status [projectId]
        </span>
      )
    },
    "create-project": async (name) => {
      if (!name) {
        return "Please provide a name for your project."
      }
      if (!name.match(/^[\w-]+$/)) {
        return "Project name must only contain alphanumeric characters, dashes, and underscores."
      }
      try {
        const createdProject = await createProjectMutation({ name })
        return (
          <span>
            Successfully created! Here are the details:
            <br />
            ID: {createdProject.id}
            <br />
            Name: {createdProject.name}
          </span>
        )
      } catch (e) {
        return e.message
      }
    },
    "attach-dependency": async (parameters) => {
      if (!parameters) {
        return "Please provide a <projectId> <dependencyName> <url> <headers> <data> for your project."
      }

      const [rawProjectid, name, url, headers, data] = parameters.split(" ")
      if (!rawProjectid || !name || !url || !headers || !data) {
        return "Please provide a <projectId> <dependencyName> <url> <headers> <data> for your project."
      }

      const projectId = parseInt(rawProjectid)
      if (isNaN(projectId)) {
        return "Project ID must be a number."
      }

      try {
        const createdDependency = await createProjectDependencyMutation({
          projectId,
          url,
          name,
          headers: JSON.parse(headers),
          data: JSON.parse(data),
        })

        return (
          <span>
            Successfully created! Here are the details:
            <br />
            ID: {createdDependency.id}
            <br />
            Name: {createdDependency.name}
            <br />
            URL: {createdDependency.url}
            <br />
            Headers: {JSON.stringify(createdDependency.headers)}
            <br />
            Data: {JSON.stringify(createdDependency.data)}
            <br />
          </span>
        )
      } catch (e) {
        return e.message
      }
    },
    "attach-managed-dependency": async (parameters) => {
      if (!parameters) {
        return "Parameters must be: <projectId> <managedDependencyId>"
      }

      const [rawProjectId, rawManagedDependecyId] = parameters.split(" ")
      const projectId = parseInt(rawProjectId)
      const managedDependencyId = parseInt(rawManagedDependecyId)

      if (isNaN(projectId) || isNaN(managedDependencyId)) {
        return "Project ID and Managed Dependency ID must be numbers."
      }

      await attachManagedDependencyToProjectMutation({
        projectId,
        managedDependencyId,
      })

      return "Successfully attached managed dependency to project."
    },
    // Parameters are in the form of a string separated by spaces with values <projectId> <status>
    "set-project-status": async (parameters) => {
      if (!parameters) {
        return "Please provide a <projectId> <status> for your project."
      }

      const [rawProjectid, ...rawStatus] = parameters.split(" ")
      const status = rawStatus.join(" ")

      if (!rawProjectid || !status) {
        return "Please provide a <projectId> <status> for your project."
      }

      const projectId = parseInt(rawProjectid)
      if (isNaN(projectId)) {
        return "Project ID must be a number."
      }

      try {
        const updatedProject = await updateProjectMutation({
          id: projectId,
          status: status as string,
        })

        return (
          <span>
            Successfully updated! Here are the details:
            <br />
            ID: {updatedProject.id}
            <br />
            Name: {updatedProject.name}
            <br />
            Status: {updatedProject.status}
          </span>
        )
      } catch (e) {
        return e.message
      }
    },
    "clear-project-status": async (parameters) => {
      if (!parameters) {
        return "Please provide a <projectId> for your project."
      }

      const [rawProjectid] = parameters.split(" ")
      if (!rawProjectid) {
        return "Please provide a <projectId> for your project."
      }

      const projectId = parseInt(rawProjectid)
      if (isNaN(projectId)) {
        return "Project ID must be a number."
      }

      try {
        const updatedProject = await updateProjectMutation({
          id: projectId,
          status: null,
        })

        return (
          <span>
            Successfully updated! Here are the details:
            <br />
            ID: {updatedProject.id}
            <br />
            Name: {updatedProject.name}
            <br />
            Status: {updatedProject.status}
          </span>
        )
      } catch (e) {
        return e.message
      }
    },
  }

  return (
    <div className="is-fullheight-100vh-no-footer">
      <ReactTerminal commands={commands} theme="material-ocean" showControlBar={false} />
    </div>
  )
}

export default Commandline
