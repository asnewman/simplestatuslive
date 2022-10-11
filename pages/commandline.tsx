import { useMutation } from "@blitzjs/rpc"
import createProjectDependency from "app/project-dependencies/mutations/createProjectDependency"
import createProject from "app/projects/mutations/createProject"
import { ReactTerminal } from "react-terminal"

function Commandline(props) {
  const [createProjectMutation] = useMutation(createProject)
  const [createProjectDependencyMutation] = useMutation(createProjectDependency)
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
  }

  return (
    <div className="is-fullheight-100vh-no-footer">
      <ReactTerminal commands={commands} theme="material-ocean" showControlBar={false} />
    </div>
  )
}

export default Commandline
