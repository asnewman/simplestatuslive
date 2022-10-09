import { useMutation } from "@blitzjs/rpc"
import createProject from "app/projects/mutations/createProject"
import { ReactTerminal } from "react-terminal"

function Commandline(props) {
  const [createProjectMutation] = useMutation(createProject)
  // Define commands here
  const commands = {
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
  }

  return (
    <div className="is-fullheight-100vh-no-footer">
      <ReactTerminal commands={commands} theme="material-ocean" showControlBar={false} />
    </div>
  )
}

export default Commandline
